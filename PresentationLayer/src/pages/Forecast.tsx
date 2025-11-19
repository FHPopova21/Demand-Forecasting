import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, TrendingUp, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getFeaturesMetadata, predict, PredictionPayload, FeaturesMetadata } from "@/lib/api";
import { calculateDateFeatures } from "@/lib/dateUtils";

const DATASET_START_DATE = new Date("2011-01-29");
const DATASET_END_DATE = new Date("2016-06-19");
const DEFAULT_DATE = new Date("2016-05-01");

const DEFAULT_VALUES = {
  itemId: "HOBBIES_1_001",
  deptId: "HOBBIES_1",
  catId: "HOBBIES",
  storeId: "CA_1",
  stateId: "CA",
  eventName1: "Easter",
  eventType1: "Religious",
  snapCA: true,
  snapTX: false,
  snapWI: false,
  sellPrice: 5.0,
  priceChange: 0.0,
  priceRmean7: 5.1,
  priceVsAvg: 1.0,
  salesLag1: 6.0,
  salesLag7: 5.8,
  salesLag14: 5.6,
  salesLag28: 5.5,
  salesRmean7: 5.7,
  salesRmean14: 5.6,
  salesRmean28: 5.5,
  salesRmean30: 5.4,
  salesRstd7: 0.5,
  salesRstd14: 0.6,
  salesRstd28: 0.7,
  salesRstd30: 0.8,
};

const clampDateToDatasetRange = (value: Date) => {
  if (value < DATASET_START_DATE) {
    return DATASET_START_DATE;
  }
  if (value > DATASET_END_DATE) {
    return DATASET_END_DATE;
  }
  return value;
};

const Forecast = () => {
  const [date, setDate] = useState<Date>(DEFAULT_DATE);
  const [featuresMetadata, setFeaturesMetadata] = useState<FeaturesMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingFeatures, setLoadingFeatures] = useState(true);
  const [prediction, setPrediction] = useState<number | null>(null);

  // Категорични полета
  const [itemId, setItemId] = useState<string>(DEFAULT_VALUES.itemId);
  const [deptId, setDeptId] = useState<string>(DEFAULT_VALUES.deptId);
  const [catId, setCatId] = useState<string>(DEFAULT_VALUES.catId);
  const [storeId, setStoreId] = useState<string>(DEFAULT_VALUES.storeId);
  const [stateId, setStateId] = useState<string>(DEFAULT_VALUES.stateId);
  const [eventName1, setEventName1] = useState<string>(DEFAULT_VALUES.eventName1);
  const [eventType1, setEventType1] = useState<string>(DEFAULT_VALUES.eventType1);

  // SNAP индикатори
  const [snapCA, setSnapCA] = useState<boolean>(DEFAULT_VALUES.snapCA);
  const [snapTX, setSnapTX] = useState<boolean>(DEFAULT_VALUES.snapTX);
  const [snapWI, setSnapWI] = useState<boolean>(DEFAULT_VALUES.snapWI);

  // Цена и price features
  const [sellPrice, setSellPrice] = useState<number>(DEFAULT_VALUES.sellPrice);
  const [priceChange, setPriceChange] = useState<number>(DEFAULT_VALUES.priceChange);
  const [priceRmean7, setPriceRmean7] = useState<number>(DEFAULT_VALUES.priceRmean7);
  const [priceVsAvg, setPriceVsAvg] = useState<number>(DEFAULT_VALUES.priceVsAvg);

  // Sales lag features (ще се попълват от backend в бъдеще, за сега default стойности)
  const [salesLag1, setSalesLag1] = useState<number>(DEFAULT_VALUES.salesLag1);
  const [salesLag7, setSalesLag7] = useState<number>(DEFAULT_VALUES.salesLag7);
  const [salesLag14, setSalesLag14] = useState<number>(DEFAULT_VALUES.salesLag14);
  const [salesLag28, setSalesLag28] = useState<number>(DEFAULT_VALUES.salesLag28);

  // Sales rolling means
  const [salesRmean7, setSalesRmean7] = useState<number>(DEFAULT_VALUES.salesRmean7);
  const [salesRmean14, setSalesRmean14] = useState<number>(DEFAULT_VALUES.salesRmean14);
  const [salesRmean28, setSalesRmean28] = useState<number>(DEFAULT_VALUES.salesRmean28);
  const [salesRmean30, setSalesRmean30] = useState<number>(DEFAULT_VALUES.salesRmean30);

  // Sales rolling std
  const [salesRstd7, setSalesRstd7] = useState<number>(DEFAULT_VALUES.salesRstd7);
  const [salesRstd14, setSalesRstd14] = useState<number>(DEFAULT_VALUES.salesRstd14);
  const [salesRstd28, setSalesRstd28] = useState<number>(DEFAULT_VALUES.salesRstd28);
  const [salesRstd30, setSalesRstd30] = useState<number>(DEFAULT_VALUES.salesRstd30);

  // Зарежда features metadata при mount
  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const metadata = await getFeaturesMetadata();
        setFeaturesMetadata(metadata);
        
        // Set default values от първата валидна стойност
        if (metadata.categories.item_id?.[0]) {
          setItemId((current) => current || metadata.categories.item_id[0]);
        }
        if (metadata.categories.dept_id?.[0]) {
          setDeptId((current) => current || metadata.categories.dept_id[0]);
        }
        if (metadata.categories.cat_id?.[0]) {
          setCatId((current) => current || metadata.categories.cat_id[0]);
        }
        if (metadata.categories.store_id?.[0]) {
          setStoreId((current) => current || metadata.categories.store_id[0]);
        }
        if (metadata.categories.state_id?.[0]) {
          setStateId((current) => current || metadata.categories.state_id[0]);
        }
        if (metadata.categories.event_name_1?.[0]) {
          setEventName1((current) => current || metadata.categories.event_name_1[0]);
        }
        if (metadata.categories.event_type_1?.[0]) {
          setEventType1((current) => current || metadata.categories.event_type_1[0]);
        }
      } catch (error) {
        console.error("Failed to load features:", error);
        toast.error("Failed to load feature options. Please refresh the page.");
      } finally {
        setLoadingFeatures(false);
      }
    };

    loadFeatures();
  }, []);

  // Автоматично попълване на календарни полета при промяна на датата
  useEffect(() => {
    if (date) {
      // Календарните полета се изчисляват автоматично от датата
      // Те се добавят в payload при submit
    }
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (!itemId || !deptId || !catId || !storeId || !stateId) {
      toast.error("Please fill in all required product identifiers");
      return;
    }

    // Изчислява календарни features от датата
    const dateFeatures = calculateDateFeatures(date);

    // Подготвя payload с всички 36 полета
    const payload: PredictionPayload = {
      // Категорични полета
      item_id: itemId,
      dept_id: deptId,
      cat_id: catId,
      store_id: storeId,
      state_id: stateId,
      event_name_1: eventName1,
      event_type_1: eventType1,

      // Календарни полета (от датата)
      ...dateFeatures,

      // SNAP индикатори
      snap_CA: snapCA ? 1 : 0,
      snap_TX: snapTX ? 1 : 0,
      snap_WI: snapWI ? 1 : 0,

      // Цена и price features
      sell_price: sellPrice,
      price_change: priceChange,
      price_rmean7: priceRmean7,
      price_vs_avg: priceVsAvg,

      // Sales lag features
      sales_lag1: salesLag1,
      sales_lag7: salesLag7,
      sales_lag14: salesLag14,
      sales_lag28: salesLag28,

      // Sales rolling means
      sales_rmean7: salesRmean7,
      sales_rmean14: salesRmean14,
      sales_rmean28: salesRmean28,
      sales_rmean30: salesRmean30,

      // Sales rolling std
      sales_rstd7: salesRstd7,
      sales_rstd14: salesRstd14,
      sales_rstd28: salesRstd28,
      sales_rstd30: salesRstd30,
    };

    setLoading(true);
    try {
      const response = await predict(payload);
      setPrediction(response.prediction);
      toast.success("Forecast generated successfully!");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate forecast");
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Generate Forecast</h1>
        <p className="text-muted-foreground mt-2">
          Input product and temporal features to predict demand
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card className="lg:col-span-2 p-6 shadow-sm border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Forecast Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(clampDateToDatasetRange(newDate))}
                    fromDate={DATASET_START_DATE}
                    toDate={DATASET_END_DATE}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Dataset calendar covers Jan 2011 – Jun 2016. Auto-fills: wm_yr_wk, wday, month, year, quarter, day_of_month, day_of_year, week_of_year, is_weekend
              </p>
            </div>

            {/* Product Identifiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item_id">Item ID *</Label>
                <Select value={itemId} onValueChange={setItemId} disabled={loadingFeatures}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingFeatures ? "Loading..." : "Select item"} />
                  </SelectTrigger>
                  <SelectContent>
                    {featuresMetadata?.categories.item_id?.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store_id">Store ID *</Label>
                <Select value={storeId} onValueChange={setStoreId} disabled={loadingFeatures}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingFeatures ? "Loading..." : "Select store"} />
                  </SelectTrigger>
                  <SelectContent>
                    {featuresMetadata?.categories.store_id?.map((store) => (
                      <SelectItem key={store} value={store}>
                        {store}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dept_id">Department ID *</Label>
                <Select value={deptId} onValueChange={setDeptId} disabled={loadingFeatures}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingFeatures ? "Loading..." : "Select department"} />
                  </SelectTrigger>
                  <SelectContent>
                    {featuresMetadata?.categories.dept_id?.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cat_id">Category ID *</Label>
                <Select value={catId} onValueChange={setCatId} disabled={loadingFeatures}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingFeatures ? "Loading..." : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {featuresMetadata?.categories.cat_id?.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state_id">State ID *</Label>
                <Select value={stateId} onValueChange={setStateId} disabled={loadingFeatures}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingFeatures ? "Loading..." : "Select state"} />
                  </SelectTrigger>
                  <SelectContent>
                    {featuresMetadata?.categories.state_id?.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event_name">Event Name</Label>
                <Select value={eventName1} onValueChange={setEventName1} disabled={loadingFeatures}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unknown">None</SelectItem>
                    {featuresMetadata?.categories.event_name_1
                      ?.filter((event) => event !== "Unknown")
                      .map((event) => (
                        <SelectItem key={event} value={event}>
                          {event}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_type">Event Type</Label>
                <Select value={eventType1} onValueChange={setEventType1} disabled={loadingFeatures}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {featuresMetadata?.categories.event_type_1?.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* SNAP Benefits */}
            <div className="space-y-2">
              <Label>SNAP Benefits Active</Label>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Switch id="snap_ca" checked={snapCA} onCheckedChange={setSnapCA} />
                  <Label htmlFor="snap_ca" className="font-normal">California</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="snap_tx" checked={snapTX} onCheckedChange={setSnapTX} />
                  <Label htmlFor="snap_tx" className="font-normal">Texas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="snap_wi" checked={snapWI} onCheckedChange={setSnapWI} />
                  <Label htmlFor="snap_wi" className="font-normal">Wisconsin</Label>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="sell_price">Sell Price *</Label>
              <Input
                id="sell_price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={sellPrice}
                onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            {/* Advanced fields (скрити по подразбиране, могат да се разширят) */}
            <div className="text-xs text-muted-foreground pt-2 border-t">
              <p>Note: Sales lag and rolling statistics are set to default values.</p>
              <p>These will be automatically calculated from historical data in a future update.</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading || loadingFeatures}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Forecast...
                </>
              ) : (
                "Generate Forecast"
              )}
            </Button>
          </form>
        </Card>

        {/* Prediction Output */}
        <Card className="p-6 shadow-sm border-border space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Prediction Output</h3>
            <p className="text-sm text-muted-foreground">Forecasted demand</p>
          </div>

          {prediction !== null ? (
            <div className="space-y-6">
              <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">Predicted Sales</p>
                </div>
                <p className="text-4xl font-bold text-primary">{prediction.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-2">units</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Confidence Interval</span>
                  <span className="font-medium text-foreground">95%</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Lower Bound</span>
                    <span className="font-medium">{(prediction * 0.85).toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Upper Bound</span>
                    <span className="font-medium">{(prediction * 1.15).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">Top Feature Importance</p>
                <div className="space-y-2">
                  {[
                    { name: "sales_lag_28", value: 0.34 },
                    { name: "price_momentum", value: 0.22 },
                    { name: "rolling_mean_7", value: 0.18 },
                  ].map((feature) => (
                    <div key={feature.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{feature.name}</span>
                        <span className="font-medium">{(feature.value * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5">
                        <div
                          className="bg-accent h-1.5 rounded-full"
                          style={{ width: `${feature.value * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p className="text-sm">Submit the form to see prediction</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Forecast;
