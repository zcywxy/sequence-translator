import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import {
  GLOBAL_KEY,
  DEFAULT_RULE,
  GLOBLA_RULE,
  OPT_LANGS_FROM,
  OPT_LANGS_TO,
  URL_KISS_RULES_NEW_ISSUE,
  DEFAULT_TRANS_TAG,
  OPT_SPLIT_PARAGRAPH_DISABLE,
  OPT_SPLIT_PARAGRAPH_ALL,
} from "../../config";
import { useState, useEffect, useMemo } from "react";
import { useI18n } from "../../hooks/I18n";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRules } from "../../hooks/Rules";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import { useAlert } from "../../hooks/Alert";
import { debounce } from "../../libs/utils";
import { getRulesOld } from "../../libs/storage";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import HelpButton from "./HelpButton";
import DownloadButton from "./DownloadButton";
import UploadButton from "./UploadButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import ValidationInput from "../../hooks/ValidationInput";
import { kissLog } from "../../libs/log";
import { useApiList } from "../../hooks/Api";
import ShowMoreButton from "./ShowMoreButton";
import { useConfirm } from "../../hooks/Confirm";
import { useAllTextStyles } from "../../hooks/CustomStyles";

const calculateInitialValues = (rule) => {
  const base = rule?.pattern === "*" ? GLOBLA_RULE : DEFAULT_RULE;
  return { ...base, ...(rule || {}) };
};

function RuleFields({ rule, rules, setShow, setKeyword }) {
  const editMode = useMemo(() => !!rule, [rule]);

  const i18n = useI18n();
  const [disabled, setDisabled] = useState(editMode);
  const [errors, setErrors] = useState({});
  const [initialFormValues, setInitialFormValues] = useState(() =>
    calculateInitialValues(rule)
  );
  const [formValues, setFormValues] = useState(initialFormValues);
  const [showMore, setShowMore] = useState(!rules);
  const { enabledApis } = useApiList();
  const { allTextStyles } = useAllTextStyles();

  useEffect(() => {
    const newInitialValues = calculateInitialValues(rule);
    setInitialFormValues(newInitialValues);
    setFormValues(newInitialValues);
  }, [rule]);

  const {
    pattern,
    selector,
    keepSelector = "",
    rootsSelector = "",
    ignoreSelector = "",
    terms = "",
    aiTerms = "",
    termsStyle = "",
    textExtStyle = "",
    selectStyle = "",
    parentStyle = "",
    grandStyle = "",
    injectJs = "",
    injectCss = "",
    apiSlug,
    fromLang,
    toLang,
    textStyle,
    transOpen,
    // bgColor,
    // textDiyStyle,
    transOnly = "false",
    autoScan = "true",
    hasRichText = "true",
    hasShadowroot = "false",
    // transTiming = OPT_TIMING_PAGESCROLL,
    transTag = DEFAULT_TRANS_TAG,
    transTitle = "false",
    // detectRemote = "true",
    // skipLangs = [],
    // fixerSelector = "",
    // fixerFunc = "-",
    transStartHook = "",
    transEndHook = "",
    // transRemoveHook = "",
    splitParagraph = OPT_SPLIT_PARAGRAPH_DISABLE,
    splitLength = 0,
  } = formValues;

  const isModified = useMemo(() => {
    return JSON.stringify(initialFormValues) !== JSON.stringify(formValues);
  }, [initialFormValues, formValues]);

  const hasSamePattern = (str) => {
    for (const item of rules.list) {
      if (item.pattern === str && rule?.pattern !== str) {
        return true;
      }
    }
    return false;
  };

  const handleFocus = (e) => {
    e.preventDefault();
    const { name } = e.target;
    setErrors((pre) => ({ ...pre, [name]: "" }));
  };

  const handlePatternChange = useMemo(
    () =>
      debounce(async (patterns) => {
        setKeyword(patterns.trim());
      }, 500),
    [setKeyword]
  );

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormValues((pre) => ({ ...pre, [name]: value }));
    if (name === "pattern" && !editMode) {
      handlePatternChange(value);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (editMode) {
      setDisabled(true);
    } else {
      setShow(false);
    }
    setErrors({});
    setFormValues(initialFormValues);
  };

  const handleRestore = (e) => {
    e.preventDefault();
    setFormValues(({ pattern }) => ({
      ...(pattern === "*" ? GLOBLA_RULE : DEFAULT_RULE),
      pattern,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!pattern.trim()) {
      errors.pattern = i18n("error_cant_be_blank");
    }
    if (hasSamePattern(pattern)) {
      errors.pattern = i18n("error_duplicate_values");
    }
    if (pattern === "*" && !errors.pattern && !selector.trim()) {
      errors.selector = i18n("error_cant_be_blank");
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    if (editMode) {
      // 编辑
      setDisabled(true);
      rules.put(rule.pattern, formValues);
    } else {
      // 添加
      rules.add(formValues);
      setShow(false);
      setFormValues(initialFormValues);
    }
  };

  const GlobalItem = rule?.pattern !== "*" && (
    <MenuItem key={GLOBAL_KEY} value={GLOBAL_KEY}>
      {GLOBAL_KEY}
    </MenuItem>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          size="small"
          label={i18n("pattern")}
          error={!!errors.pattern}
          helperText={errors.pattern || i18n("pattern_helper")}
          name="pattern"
          value={pattern}
          disabled={rule?.pattern === "*" || disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          multiline
        />
        <TextField
          size="small"
          label={i18n("root_selector")}
          helperText={i18n("root_selector_helper")}
          name="rootsSelector"
          value={rootsSelector}
          disabled={disabled}
          onChange={handleChange}
          multiline
        />
        <TextField
          size="small"
          label={i18n("ignore_selector")}
          helperText={i18n("ignore_selector_helper")}
          name="ignoreSelector"
          value={ignoreSelector}
          disabled={disabled}
          onChange={handleChange}
          multiline
        />
        <TextField
          size="small"
          label={i18n("target_selector")}
          error={!!errors.selector}
          helperText={errors.selector || i18n("selector_helper")}
          name="selector"
          value={selector}
          disabled={autoScan === "true" || disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          multiline
        />
        <TextField
          size="small"
          label={i18n("keep_selector")}
          helperText={i18n("keep_selector_helper")}
          name="keepSelector"
          value={keepSelector}
          disabled={disabled}
          onChange={handleChange}
          multiline
        />

        <Box>
          <Grid container spacing={2} columns={12}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                select
                size="small"
                fullWidth
                name="transOpen"
                value={transOpen}
                label={i18n("translate_switch")}
                disabled={disabled}
                onChange={handleChange}
              >
                {GlobalItem}
                <MenuItem value={"true"}>{i18n("default_enabled")}</MenuItem>
                <MenuItem value={"false"}>{i18n("default_disabled")}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                select
                size="small"
                fullWidth
                name="apiSlug"
                value={apiSlug}
                label={i18n("translate_service")}
                disabled={disabled}
                onChange={handleChange}
              >
                {GlobalItem}
                {enabledApis.map((api) => (
                  <MenuItem key={api.apiSlug} value={api.apiSlug}>
                    {api.apiName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                select
                size="small"
                fullWidth
                name="fromLang"
                value={fromLang}
                label={i18n("from_lang")}
                disabled={disabled}
                onChange={handleChange}
              >
                {GlobalItem}
                {OPT_LANGS_FROM.map(([lang, name]) => (
                  <MenuItem key={lang} value={lang}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                select
                size="small"
                fullWidth
                name="toLang"
                value={toLang}
                label={i18n("to_lang")}
                disabled={disabled}
                onChange={handleChange}
              >
                {GlobalItem}
                {OPT_LANGS_TO.map(([lang, name]) => (
                  <MenuItem key={lang} value={lang}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                select
                size="small"
                fullWidth
                name="autoScan"
                value={autoScan}
                label={i18n("auto_scan_page")}
                disabled={disabled}
                onChange={handleChange}
              >
                {GlobalItem}
                <MenuItem value={"false"}>{i18n("disable")}</MenuItem>
                <MenuItem value={"true"}>{i18n("enable")}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                select
                size="small"
                fullWidth
                name="hasRichText"
                value={hasRichText}
                label={i18n("has_rich_text")}
                disabled={disabled}
                onChange={handleChange}
              >
                {GlobalItem}
                <MenuItem value={"false"}>{i18n("disable")}</MenuItem>
                <MenuItem value={"true"}>{i18n("enable")}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                select
                size="small"
                fullWidth
                name="hasShadowroot"
                value={hasShadowroot}
                label={i18n("has_shadowroot")}
                disabled={disabled}
                onChange={handleChange}
              >
                {GlobalItem}
                <MenuItem value={"false"}>{i18n("disable")}</MenuItem>
                <MenuItem value={"true"}>{i18n("enable")}</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                select
                size="small"
                fullWidth
                name="transOnly"
                value={transOnly}
                label={i18n("show_only_translations")}
                disabled={disabled}
                onChange={handleChange}
              >
                {GlobalItem}
                <MenuItem value={"false"}>{i18n("disable")}</MenuItem>
                <MenuItem value={"true"}>{i18n("enable")}</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                select
                size="small"
                fullWidth
                name="splitParagraph"
                value={splitParagraph}
                label={i18n("split_paragraph")}
                disabled={disabled}
                onChange={handleChange}
              >
                {GlobalItem}
                {OPT_SPLIT_PARAGRAPH_ALL.map((item) => (
                  <MenuItem key={item} value={item}>
                    {i18n(item)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <ValidationInput
                fullWidth
                size="small"
                label={i18n("split_length")}
                type="number"
                name="splitLength"
                value={splitLength}
                disabled={disabled}
                onChange={handleChange}
                min={0}
                max={1000}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                select
                size="small"
                fullWidth
                name="transTitle"
                value={transTitle}
                label={i18n("translate_page_title")}
                disabled={disabled}
                onChange={handleChange}
              >
                {GlobalItem}
                <MenuItem value={"false"}>{i18n("disable")}</MenuItem>
                <MenuItem value={"true"}>{i18n("enable")}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                select
                size="small"
                fullWidth
                name="transTag"
                value={transTag}
                label={i18n("translation_element_tag")}
                disabled={disabled}
                onChange={handleChange}
              >
                {GlobalItem}
                <MenuItem value={"span"}>{`<span>`}</MenuItem>
                <MenuItem value={"font"}>{`<font>`}</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                select
                size="small"
                fullWidth
                name="textStyle"
                value={textStyle}
                label={i18n("text_style")}
                disabled={disabled}
                onChange={handleChange}
              >
                {GlobalItem}
                {allTextStyles.map((item) => (
                  <MenuItem key={item.styleSlug} value={item.styleSlug}>
                    {item.styleName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>

        {showMore && (
          <>
            <TextField
              size="small"
              label={i18n("terms")}
              helperText={i18n("terms_helper")}
              name="terms"
              value={terms}
              disabled={disabled}
              onChange={handleChange}
              multiline
              maxRows={10}
            />
            <TextField
              size="small"
              label={i18n("ai_terms")}
              helperText={i18n("ai_terms_helper")}
              name="aiTerms"
              value={aiTerms}
              disabled={disabled}
              onChange={handleChange}
              multiline
              maxRows={10}
            />

            <TextField
              size="small"
              label={i18n("terms_style")}
              name="termsStyle"
              value={termsStyle}
              disabled={disabled}
              onChange={handleChange}
              maxRows={10}
              multiline
            />
            <TextField
              size="small"
              label={i18n("text_ext_style")}
              name="textExtStyle"
              value={textExtStyle}
              disabled={disabled}
              onChange={handleChange}
              maxRows={10}
              multiline
            />
            <TextField
              size="small"
              label={i18n("selector_style")}
              name="selectStyle"
              value={selectStyle}
              disabled={disabled}
              onChange={handleChange}
              maxRows={10}
              multiline
            />
            <TextField
              size="small"
              label={i18n("selector_parent_style")}
              name="parentStyle"
              value={parentStyle}
              disabled={disabled}
              onChange={handleChange}
              maxRows={10}
              multiline
            />
            <TextField
              size="small"
              label={i18n("selector_grand_style")}
              name="grandStyle"
              value={grandStyle}
              disabled={disabled}
              onChange={handleChange}
              maxRows={10}
              multiline
            />

            <TextField
              size="small"
              label={i18n("translate_start_hook")}
              helperText={i18n("translate_start_hook_helper")}
              name="transStartHook"
              value={transStartHook}
              disabled={disabled}
              onChange={handleChange}
              multiline
              maxRows={10}
            />
            <TextField
              size="small"
              label={i18n("translate_end_hook")}
              helperText={i18n("translate_end_hook_helper")}
              name="transEndHook"
              value={transEndHook}
              disabled={disabled}
              onChange={handleChange}
              multiline
              maxRows={10}
            />
            {/* <TextField
              size="small"
              label={i18n("translate_remove_hook")}
              helperText={i18n("translate_remove_hook_helper")}
              name="transRemoveHook"
              value={transRemoveHook}
              disabled={disabled}
              onChange={handleChange}
              multiline
              maxRows={10}
            /> */}

            <TextField
              size="small"
              label={i18n("inject_css")}
              helperText={i18n("inject_css_helper")}
              name="injectCss"
              value={injectCss}
              disabled={disabled}
              onChange={handleChange}
              maxRows={10}
              multiline
            />
            <TextField
              size="small"
              label={i18n("inject_js")}
              helperText={i18n("inject_js_helper")}
              name="injectJs"
              value={injectJs}
              disabled={disabled}
              onChange={handleChange}
              maxRows={10}
              multiline
            />
          </>
        )}

        {rules &&
          (editMode ? (
            // 编辑
            <Stack direction="row" spacing={2}>
              {disabled ? (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={(e) => {
                      e.preventDefault();
                      setDisabled(false);
                    }}
                    startIcon={<EditIcon />}
                  >
                    {i18n("edit")}
                  </Button>
                  {rule?.pattern !== "*" && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.preventDefault();
                        rules.del(rule.pattern);
                      }}
                      startIcon={<DeleteIcon />}
                    >
                      {i18n("delete")}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    type="submit"
                    startIcon={<SaveIcon />}
                    disabled={!isModified}
                  >
                    {i18n("save")}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                  >
                    {i18n("cancel")}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleRestore}
                  >
                    {i18n("restore_default")}
                  </Button>
                </>
              )}
              <ShowMoreButton showMore={showMore} onChange={setShowMore} />
            </Stack>
          ) : (
            // 添加
            <Stack direction="row" spacing={2}>
              <Button
                size="small"
                variant="contained"
                type="submit"
                startIcon={<SaveIcon />}
              >
                {i18n("save")}
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={handleCancel}
                startIcon={<CancelIcon />}
              >
                {i18n("cancel")}
              </Button>
              <ShowMoreButton showMore={showMore} onChange={setShowMore} />
            </Stack>
          ))}
      </Stack>
    </form>
  );
}

function RuleAccordion({ rule, rules, isExpanded = false }) {
  const i18n = useI18n();
  const [expanded, setExpanded] = useState(isExpanded);

  const handleChange = (e) => {
    setExpanded((pre) => !pre);
  };

  return (
    <Accordion expanded={expanded} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{
            opacity: rules ? 1 : 0.5,
            overflowWrap: "anywhere",
          }}
        >
          {rule.pattern === GLOBAL_KEY
            ? `[${i18n("global_rule")}] ${rule.pattern}`
            : rule.pattern}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {expanded && <RuleFields rule={rule} rules={rules} />}
      </AccordionDetails>
    </Accordion>
  );
}

function ShareButton({ rules }) {
  const alert = useAlert();
  const i18n = useI18n();
  const handleClick = async () => {
    alert.warning(i18n("error_sync_setting"));
  };

  return (
    <Button
      size="small"
      variant="outlined"
      onClick={handleClick}
      startIcon={<ShareIcon />}
    >
      {i18n("share")}
    </Button>
  );
}

function UserRules({ rules }) {
  const i18n = useI18n();
  const [showAdd, setShowAdd] = useState(false);
  const [keyword, setKeyword] = useState("");
  const confirm = useConfirm();

  const handleImport = async (data) => {
    try {
      await rules.merge(JSON.parse(data));
    } catch (err) {
      kissLog("import rules", err);
    }
  };

  const handleClearAll = async () => {
    const isConfirmed = await confirm({
      confirmText: i18n("confirm_title"),
      cancelText: i18n("cancel"),
    });
    if (isConfirmed) {
      rules.clear();
    }
  };

  useEffect(() => {
    if (!showAdd) {
      setKeyword("");
    }
  }, [showAdd]);

  if (!rules.list) {
    return;
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        useFlexGap
        flexWrap="wrap"
      >
        <Button
          size="small"
          variant="contained"
          disabled={showAdd}
          onClick={(e) => {
            e.preventDefault();
            setShowAdd(true);
          }}
          startIcon={<AddIcon />}
        >
          {i18n("add")}
        </Button>

        <UploadButton text={i18n("import")} handleImport={handleImport} />
        <DownloadButton
          handleData={() => JSON.stringify([...rules.list], null, 2)}
          text={i18n("export")}
          fileName={`kiss-rules_v2_${Date.now()}.json`}
        />
        <DownloadButton
          handleData={async () => JSON.stringify(await getRulesOld(), null, 2)}
          text={i18n("export_old")}
          fileName={`kiss-rules_v1_${Date.now()}.json`}
        />

        <ShareButton rules={rules} />

        <Button
          size="small"
          variant="outlined"
          onClick={handleClearAll}
          startIcon={<ClearAllIcon />}
        >
          {i18n("clear_all")}
        </Button>

        <HelpButton url={URL_KISS_RULES_NEW_ISSUE} />
      </Stack>

      {showAdd && (
        <RuleFields
          rules={rules}
          setShow={setShowAdd}
          setKeyword={setKeyword}
        />
      )}

      <Box>
        {rules.list
          .filter(
            (rule) =>
              rule.pattern !== "*" &&
              (rule.pattern.includes(keyword) || keyword.includes(rule.pattern))
          )
          .map((rule) => (
            <RuleAccordion key={rule.pattern} rule={rule} rules={rules} />
          ))}
      </Box>
    </Stack>
  );
}

function GlobalRule({ rules }) {
  const globalRule = useMemo(
    () => rules.list[rules.list.length - 1],
    [rules.list]
  );

  if (!globalRule) {
    return;
  }

  return (
    <Stack spacing={3}>
      <RuleAccordion
        key={globalRule.pattern}
        rule={globalRule}
        rules={rules}
        isExpanded={true}
      />
    </Stack>
  );
}

export default function Rules() {
  const i18n = useI18n();
  const [activeTab, setActiveTab] = useState(0);
  const rules = useRules();

  const handleTabChange = (e, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Stack spacing={3}>
        <Alert severity="info">
          {i18n("rules_warn_1")}
          <br />
          {i18n("rules_warn_2")}
        </Alert>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label={i18n("global_rule")} />
            <Tab label={i18n("personal_rules")} />
          </Tabs>
        </Box>
        <div hidden={activeTab !== 0}>
          {activeTab === 0 && <GlobalRule rules={rules} />}
        </div>
        <div hidden={activeTab !== 1}>
          {activeTab === 1 && <UserRules rules={rules} />}
        </div>
      </Stack>
    </Box>
  );
}
