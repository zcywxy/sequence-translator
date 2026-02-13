import { DEFAULT_FETCH_INTERVAL } from "../config";
import { kissLog } from "./log";

class TaskPool {
  #pool = [];
  #maxRetry = 5;
  #baseRetryInterval = 1000;
  #interval;
  #isProcessing = false;
  #schedulerTimer = null;

  constructor(interval = DEFAULT_FETCH_INTERVAL, retryInterval = 1000) {
    this.#interval = interval;
    this.#baseRetryInterval = retryInterval;
  }

  #getRetryDelay(retryCount) {
    return this.#baseRetryInterval * Math.pow(2, retryCount);
  }

  async #processNext() {
    if (this.#isProcessing || this.#pool.length === 0) {
      return;
    }

    this.#isProcessing = true;

    while (this.#pool.length > 0) {
      const task = this.#pool.shift();
      if (!task) break;

      try {
        const res = await task.fn(task.args);
        task.resolve(res);
      } catch (err) {
        kissLog("task pool", err);
        if (task.retry < this.#maxRetry) {
          const retryDelay = this.#getRetryDelay(task.retry);
          kissLog(`task retry ${task.retry + 1}/${this.#maxRetry}, delay: ${retryDelay}ms`);
          this.#pool.unshift({ ...task, retry: task.retry + 1 });
          await new Promise((r) => setTimeout(r, retryDelay));
          continue;
        } else {
          task.reject(err);
        }
      }

      if (this.#pool.length > 0 && this.#interval > 0) {
        await new Promise((r) => setTimeout(r, this.#interval));
      }
    }

    this.#isProcessing = false;
  }

  push(fn, args) {
    return new Promise((resolve, reject) => {
      this.#pool.push({ fn, args, resolve, reject, retry: 0 });
      this.#processNext();
    });
  }

  update(interval) {
    if (interval >= 0) {
      this.#interval = interval;
    }
  }

  clear() {
    for (const task of this.#pool) {
      task.reject("the task pool was cleared");
    }
    this.#pool.length = 0;
    if (this.#schedulerTimer) {
      clearTimeout(this.#schedulerTimer);
      this.#schedulerTimer = null;
    }
  }
}

let fetchPool;

export const getFetchPool = (interval) => {
  if (!fetchPool) {
    fetchPool = new TaskPool(interval ?? DEFAULT_FETCH_INTERVAL);
  } else if (interval) {
    updateFetchPool(interval);
  }
  return fetchPool;
};

export const updateFetchPool = (interval) => {
  fetchPool?.update(interval);
};

export const clearFetchPool = () => {
  fetchPool?.clear();
};
