import * as echarts from 'echarts/core'
import {
  BarChart,
  GaugeChart,
  LineChart,
  PieChart,
  ScatterChart,
} from 'echarts/charts'
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  GaugeChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent,
  MarkLineComponent,
  MarkPointComponent,
  CanvasRenderer,
  SVGRenderer,
])

export default echarts
