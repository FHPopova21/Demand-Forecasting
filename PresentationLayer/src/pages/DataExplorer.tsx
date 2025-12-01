import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const architectureRows = [
  { label: "Input", value: "36 engineered features (lag, rolling stats, calendar, price, categorical encodings)" },
  { label: "Hidden stack", value: "Dense(128) → BN → Dropout 0.30 → Dense(64) → BN → Dropout 0.20 → Dense(32) → BN → Dropout 0.10" },
  { label: "Output", value: "Dense(1, linear)" },
  { label: "Parameters", value: "≈16k trainable weights" },
  { label: "Batch size", value: "1,024" },
  { label: "Optimizer", value: "Adam (default betas)" },
  { label: "LR schedule", value: "ReduceLROnPlateau (factor 0.5, patience 5, min LR 1e-7)" },
  { label: "Regularization", value: "Dropout, BatchNorm, EarlyStopping (patience 10, restore best weights)" },
  { label: "Hidden stack", value: "Dense(128) → BN → Dropout 0.30 → Dense(64) → BN → Dropout 0.20 → Dense(32) → BN → Dropout 0.10 (final production)" },

];

const testMetrics = [
  { metric: "RMSE", value: "2.2448" },
  { metric: "MAE", value: "0.8943" },
  { metric: "MSE", value: "5.0392" },
  { metric: "WRMSSE", value: "233.5%" },
  { metric: "MAPE", value: "61.0% (zero-demand rows → interpret carefully)" },
];


const versionComparison = [
  { metric: "RMSE", v1: "2.2612", v2: "2.2798", v3: "2.2472", delta: "↓ 0.014" },
  { metric: "MAE", v1: "0.9345", v2: "1.0184", v3: "0.9015", delta: "↓ 0.033" },
  { metric: "MSE", v1: "5.1130", v2: "5.1977", v3: "5.0364", delta: "↓ 0.077" },
  { metric: "Validation MSE", v1: "4.9767", v2: "5.9893", v3: "4.8226", delta: "↓ 0.154" },
  { metric: "Epochs (ES trigger)", v1: "24", v2: "13", v3: "18", delta: "—" },
];


const residualStats = [
  { label: "Mean residual", value: "0.0717" },
  { label: "Median residual", value: "-0.1356" },
  { label: "Std. deviation", value: "2.2461" },
  { label: "Min / Max", value: "-12.64 / 73.72" },
  { label: "IQR (Q25–Q75)", value: "-0.4193 – 0.1423" },
];

const bootstrapRows = [
  { metric: "MSE", mean: "5.0712", std: "0.1254", ci: "[4.839, 5.324]", cv: "2.47%" },
  { metric: "MAE", mean: "0.9019", std: "0.0048", ci: "[0.893, 0.912]", cv: "0.54%" },
  { metric: "RMSE", mean: "2.2518", std: "0.0278", ci: "[2.200, 2.307]", cv: "1.23%" },
  { metric: "WAPE", mean: "60.30%", std: "0.20%", ci: "[59.93, 60.68]", cv: "0.33%" },
];

const baselines = [
  { model: "Naive forecast (train mean)", rmse: "2.7956", mae: "1.1954", wape: "72.73%", delta: "+19.6%" },
  { model: "Linear regression", rmse: "2.7809", mae: "1.1681", wape: "71.63%", delta: "+19.2%" },
  { model: "MLP (current)", rmse: "2.2472", mae: "0.9015", wape: "60.29%", delta: "—" },
];


const checklist = [
  "Model artifact saved as models/trained_models/best_mlp_model.keras",
  "Preprocessing assets under models/preprocessing/ (scaler, encoders, feature order)",
  "Serving helper models/flask_pipeline.py exposes preprocess → predict → postprocess",
  "Custom metric (`root_mean_squared_error`) registered for reliable loading",
  "Backend README documents integration snippet for the Flask team",
];

const limitations = [
  "High relative errors on zero/low-demand items — prefer SMAPE/quantile monitoring",
  "Underestimation on promo spikes — consider uplift or hybrid rules",
  "Operational bias risk — watch SKUs where stockouts hurt most",
  "Future ideas: residual/Transformer layers, richer promo & weather features",
];

const formFieldGroups = [
  {
    title: "Product & Store IDs (5 полета)",
    description: "Категорични dropdown-и списък от preprocessing_metadata.",
    fields: ["item_id", "dept_id", "cat_id", "store_id", "state_id"],
    note: "Невалидните стойности се мапват към UNKNOWN, но не го препоръчваме.",
  },
  {
    title: "Календарни характеристики (9 полета)",
    description: "Изчисляват се автоматично от датата.",
    fields: [
      "wm_yr_wk",
      "wday",
      "month",
      "year",
      "quarter",
      "day_of_month",
      "day_of_year",
      "week_of_year",
      "is_weekend",
      "is_holiday",
    ],
    note: "Формата вече попълва тези фийчъри чрез date picker.",
  },
  {
    title: "Събития + SNAP (5 полета)",
    description: "Dropdown-и за event_name_1/event_type_1 и чекбокси за snap_CA/TX/WI.",
    fields: ["event_name_1", "event_type_1", "snap_CA", "snap_TX", "snap_WI"],
  },
  {
    title: "Цена и ценови характеристики (4 полета)",
    description: "Десетични числа → sell_price, price_change, price_rmean7, price_vs_avg.",
    fields: ["sell_price", "price_change", "price_rmean7", "price_vs_avg"],
  },
  {
    title: "Продажби: лагове и статистики (12 полета)",
    description: "sales_lag* + rolling mean/std. Препоръчително се попълват автоматично от backend.",
    fields: [
      "sales_lag1",
      "sales_lag7",
      "sales_lag14",
      "sales_lag28",
      "sales_rmean7",
      "sales_rmean14",
      "sales_rmean28",
      "sales_rmean30",
      "sales_rstd7",
      "sales_rstd14",
      "sales_rstd28",
      "sales_rstd30",
    ],
  },
];

const payloadExample = `{
  "item_id": "HOBBIES_1_001",
  "dept_id": "HOBBIES_1",
  "cat_id": "HOBBIES",
  "store_id": "CA_1",
  "state_id": "CA",
  "wm_yr_wk": 11324,
  "wday": 2,
  "month": 11,
  "year": 2025,
  "event_name_1": "Easter",
  "event_type_1": "Religious",
  "snap_CA": 1,
  "snap_TX": 0,
  "snap_WI": 0,
  "sell_price": 5.0,
  "sales_lag1": 6.0,
  "sales_lag7": 5.8,
  "sales_lag14": 5.6,
  "sales_lag28": 5.5,
  "sales_rmean7": 5.7,
  "sales_rstd7": 0.5,
  "sales_rmean14": 5.6,
  "sales_rstd14": 0.6,
  "sales_rmean28": 5.5,
  "sales_rstd28": 0.7,
  "sales_rmean30": 5.4,
  "sales_rstd30": 0.8,
  "is_weekend": 0,
  "quarter": 4,
  "day_of_month": 1,
  "day_of_year": 305,
  "week_of_year": 44,
  "is_holiday": 0,
  "price_change": 0.0,
  "price_rmean7": 5.1,
  "price_vs_avg": 1.0
}`;

const ModelCardPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase text-muted-foreground">Last updated • 17 Nov 2025</p>
        <h1 className="text-3xl font-bold text-foreground mt-1">Model Card</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          Production-ready feed-forward neural network (MLP) for daily demand forecasts. Use this page as a reference for
          architecture, metrics, diagnostics, and operational guardrails.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-sm border-border">
          <h2 className="text-lg font-semibold text-foreground">Architecture & Training</h2>
          <div className="mt-4 space-y-3">
            {architectureRows.map((row) => (
              <div key={row.label} className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{row.label}</span>
                <span className="text-sm text-muted-foreground">{row.value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Serving note: artifacts load through `models/flask_pipeline.py`, ensuring scaler and encoders stay in sync.
          </p>
        </Card>

        <Card className="p-6 shadow-sm border-border">
          <h2 className="text-lg font-semibold text-foreground">Test Metrics (Model 4.0)</h2>
          <div className="mt-4 space-y-3">
            {testMetrics.map((metric) => (
              <div key={metric.metric} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{metric.metric}</span>
                <span className="text-base font-semibold text-foreground">{metric.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 shadow-sm border-border">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-foreground">Version Comparison</h2>
          <p className="text-sm text-muted-foreground">
            Model 3.0 reintroduces ReduceLROnPlateau + tuned dropout, delivering the best RMSE/MAE so far.
          </p>
        </div>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Model 1.0</TableHead>
                <TableHead>Model 2.0</TableHead>
                <TableHead>Model 3.0</TableHead>
                <TableHead>Δ vs 1.0</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versionComparison.map((row) => (
                <TableRow key={row.metric}>
                  <TableCell className="font-medium">{row.metric}</TableCell>
                  <TableCell>{row.v1}</TableCell>
                  <TableCell>{row.v2}</TableCell>
                  <TableCell>{row.v3}</TableCell>
                  <TableCell className="text-primary font-semibold">{row.delta}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-sm border-border space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Error Analysis</h2>
            <p className="text-sm text-muted-foreground">Residual statistics on the held-out test set.</p>
          </div>
          <div className="space-y-3">
            {residualStats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{stat.label}</span>
                <span className="font-medium text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Bias is negligible (mean residual ~0.07) but residuals are heavy-tailed (promo spikes).</li>
            <li>Underestimation errors (1.82) are larger than overestimation (0.57) → monitor stockout-prone SKUs.</li>
            <li>Variance grows with demand (funnel shape). Consider segment calibration for high-volume items.</li>
          </ul>
        </Card>

        <Card className="p-6 shadow-sm border-border">
          <h2 className="text-lg font-semibold text-foreground">Bootstrap Stability (100 resamples)</h2>
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Mean</TableHead>
                  <TableHead>Std</TableHead>
                  <TableHead>95% CI</TableHead>
                  <TableHead>CV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bootstrapRows.map((row) => (
                  <TableRow key={row.metric}>
                    <TableCell className="font-medium">{row.metric}</TableCell>
                    <TableCell>{row.mean}</TableCell>
                    <TableCell>{row.std}</TableCell>
                    <TableCell>{row.ci}</TableCell>
                    <TableCell>{row.cv}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            CV(RMSE) = 1.23% ⇒ predictions stay stable under resampling, suitable for production serving.
          </p>
        </Card>
      </div>

      <Card className="p-6 shadow-sm border-border">
        <h2 className="text-lg font-semibold text-foreground">Baseline Comparison</h2>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>RMSE</TableHead>
                <TableHead>MAE</TableHead>
                <TableHead>WAPE</TableHead>
                <TableHead>Δ RMSE vs MLP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {baselines.map((row) => (
                <TableRow key={row.model}>
                  <TableCell className="font-medium">{row.model}</TableCell>
                  <TableCell>{row.rmse}</TableCell>
                  <TableCell>{row.mae}</TableCell>
                  <TableCell>{row.wape}</TableCell>
                  <TableCell className={row.delta === "—" ? "text-foreground" : "text-primary font-semibold"}>
                    {row.delta}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          MLP delivers ~19% lower RMSE and ~24% lower MAE versus naive/linear baselines, validating deployment.
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-sm border-border">
          <h2 className="text-lg font-semibold text-foreground">Flask Integration Checklist</h2>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-4 space-y-2">
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-4">
            Import helpers, map the 36 expected features, and reuse the shared scaler/encoders for consistent predictions.
          </p>
        </Card>

        <Card className="p-6 shadow-sm border-border">
          <h2 className="text-lg font-semibold text-foreground">Known Limitations & Next Steps</h2>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-4 space-y-2">
            {limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-6 shadow-sm border-border">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-foreground">Forecast Form Fields (36)</h2>
          <p className="text-sm text-muted-foreground">
            Синтезирано от <code>reports/PredictFormFields.md</code>. Всички полета са задължителни; липсващи стойности водят до preprocessing грешка.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {formFieldGroups.map((group) => (
            <Card key={group.title} className="p-4 border-border bg-muted/20 shadow-none">
              <h3 className="font-semibold text-foreground">{group.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-foreground">
                {group.fields.map((field) => (
                  <span key={field} className="px-2 py-1 bg-background border border-border rounded-md font-medium">
                    {field}
                  </span>
                ))}
              </div>
              {group.note && <p className="text-xs text-muted-foreground mt-3">{group.note}</p>}
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-2">Примерен payload</h3>
          <pre className="bg-background border border-border rounded-lg p-4 text-xs overflow-auto">
            <code>{payloadExample}</code>
          </pre>
        </div>
        <ul className="mt-4 list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Изборът на дата попълва календарните полета автоматично.</li>
          <li>Изборът на item_id може да тригърне backend да върне всички sales_lag/rolling стойности.</li>
          <li>SNAP и събитията са чекбокси/ dropdown-и; валидирай стойностите срещу metadata списъците.</li>
        </ul>
      </Card>
    </div>
  );
};

export default ModelCardPage;
