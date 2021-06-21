/**
 * Useful sources:
 *  - core/types/*
 *  - graphing-calc/models/*
 *  - core/graphing-calc/json/*
 */
export interface State {
  version: 8;
  randomSeed?: string;
  graph: GrapherState;
  expressions: {
    list: ListState;
  };
}

type ArrowMode = "NONE" | "POSITIVE" | "BOTH";

interface GrapherState {
  viewport: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
  xAxisMinorSubdivisions?: number;
  yAxisMinorSubdivisions?: number;
  degreeMode?: boolean;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  xAxisNumbers?: boolean;
  yAxisNumbers?: boolean;
  polarNumbers?: boolean;
  enableTabindex?: boolean;
  xAxisStep?: number;
  yAxisStep?: number;
  xAxisArrowMode?: ArrowMode;
  yAxisArrowMode?: ArrowMode;
  xAxisLabel?: string;
  yAxisLabel?: string;
  squareAxes?: boolean;
  restrictGridToFirstQuadrant?: boolean;
  polarMode?: boolean;
}

type Latex = string;
type ID = string;

type ListState = ItemState[];

type ItemState =
  | ExpressionState
  | ImageState
  | TableState
  | FolderState
  | TextState
  | SimulationState;

interface BaseItemModel {
  id: ID;
  secret?: boolean;
}

interface NonfolderModel extends BaseItemModel {
  folderId?: ID;
}

type LineStyle = "SOLID" | "DASHED" | "DOTTED";
type PointStyle = "POINT" | "OPEN" | "CROSS";
type DragMode = "NONE" | "X" | "Y" | "XY" | "AUTO";
type LabelSize = "SMALL" | "MEDIUM" | "LARGE" | Latex;
type LabelOrientation =
  | "default"
  | "center"
  | "center_auto"
  | "auto_center"
  | "above"
  | "above_left"
  | "above_right"
  | "above_auto"
  | "below"
  | "below_left"
  | "below_right"
  | "below_auto"
  | "left"
  | "auto_left"
  | "right"
  | "auto_right";

type ClickableInfoRules = {
  // appears that `id: number` is removed
  id: string | number;
  expression: Latex;
  assignment: Latex;
}[];

interface Domain {
  min: Latex;
  max: Latex;
}

interface MaybeClickable {
  clickableInfo?: {
    enabled?: boolean;
    // description is the screen reader label
    description?: string;
    rules?: ClickableInfoRules;
  };
}
interface ExpressionState extends NonfolderModel, MaybeClickable {
  type: "expression";
  color: string;
  latex?: Latex;
  showLabel?: boolean;
  label?: string;
  hidden?: boolean;
  points?: boolean;
  lines?: boolean;
  lineStyle?: LineStyle;
  pointStyle?: PointStyle;
  fill?: boolean;
  dragMode?: DragMode;
  labelSize?: LabelSize;
  labelOrientation?: LabelOrientation;
  // extendedLabelOrientation seems like it is renamed to labelOrientation in state version 9
  extendedLabelOrientation?: LabelOrientation;
  suppressTextOutline?: boolean;
  interactiveLabel?: boolean;
  editableLabelMode?: "MATH" | "TEXT";
  residualVariable?: Latex;
  regressionParameters?: {
    // key is a LaTeX identifier
    [key: string]: number;
  };
  isLogModeRegression?: boolean;
  displayEvaluationAsFraction?: boolean;
  slider?: {
    hardMin?: boolean;
    hardMax?: boolean;
    animationPeriod?: number;
    loopMode?:
      | "LOOP_FORWARD_REVERSE"
      | "LOOP_FORWARD"
      | "PLAY_ONCE"
      | "PLAY_INDEFINITELY";
    playDirection?: 1 | -1;
    isPlaying?: boolean;
    min?: Latex;
    max?: Latex;
    step?: Latex;
  };
  polarDomain?: Domain;
  parametricDomain?: Domain;
  // seems like `domain` may be the same as `parametricDomain`
  domain?: Domain;
  cdf?: {
    show: boolean;
    min?: Latex;
    max?: Latex;
  };
  colorLatex?: Latex;
  fillOpacity?: Latex;
  lineOpacity?: Latex;
  pointOpacity?: Latex;
  pointSize?: Latex;
  lineWidth?: Latex;
  labelAngle?: Latex;
  vizProps?: {
    breadth?: Latex;
    axisOffset?: Latex;
    alignedAxis?: "x" | "y";
    showBoxplotOutliers?: boolean;
    // dotplotSize is removed in state version 9
    // "small" corresponds to pointSize=9; "large" corresponds to pointSize=20
    dotplotSize?: "small" | "large";
    binAlignment?: "left" | "center";
    // the string "binned" is never actually checked,
    // just inferred by the absence of "exact"
    dotplotXMode?: "exact" | "binned";
    // the string "count" is never actually checked,
    // just inferred by the absence of "relative" and "density"
    histogramMode?: "count" | "relative" | "density";
  };
}

interface ImageState extends NonfolderModel, MaybeClickable {
  type: "image";
  image_url: string;
  name: string;
  width?: Latex;
  height?: Latex;
  hidden?: boolean;
  center?: Latex;
  angle?: Latex;
  opacity?: Latex;
  foreground?: boolean;
  draggable?: boolean;
}

interface TableColumn {
  id: ID;
  values: Latex[];
  color: string;
  latex?: Latex;
  hidden?: boolean;
  points?: boolean;
  lines?: boolean;
  dragMode?: DragMode;
  lineStyle?: LineStyle;
  pointStyle?: PointStyle;
  colorLatex?: Latex;
  lineOpacity?: Latex;
  lineWidth?: Latex;
  pointSize?: Latex;
  pointOpacity?: Latex;
}

interface TableState extends NonfolderModel {
  type: "table";
  columns: TableColumn[];
}

interface FolderState extends BaseItemModel {
  type: "folder";
  hidden?: boolean;
  collapsed?: boolean;
  title?: string;
}

interface TextState extends NonfolderModel {
  type: "text";
  text?: string;
}

interface SimulationState extends NonfolderModel {
  type: "simulation";
  isPlaying?: boolean;
  fps?: Latex;
  clickableInfo?: {
    rules: ClickableInfoRules;
    // enabled appears removed. Only saw it in one of my graphs, so it might be manually placed there
    enabled?: boolean;
  };
}
