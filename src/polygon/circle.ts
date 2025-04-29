import Base from '../base';
import * as Utils from '../utils';
// @ts-ignore
import { Cartesian3 } from 'cesium';

import { PolygonStyle } from '../interface';

export default class Circle extends Base {
  points: Cartesian3[] = [];
  freehand: boolean;

  constructor(cesium: any, viewer: any, style?: PolygonStyle) {
    super(cesium, viewer, style, 'Circle');
    this.cesium = cesium;
    this.freehand = true;
    this.setState('drawing');
    this.tooltipController.show('点击地图确定圆心,右键取消绘制');
  }

  getType(): 'polygon' | 'line' {
    return 'polygon';
  }

  /**
   * Add points only on click events
   */
  addPoint(cartesian: Cartesian3) {
    if (this.points.length === 1 && 
        this.cesium.Cartesian3.equals(this.points[0], cartesian)) {
        this.tooltipController.show('半径不能为0，请拖动鼠标确定半径');
        return; // 忽略重合的点
    }
    this.points.push(cartesian);
    if (this.points.length === 1) {
        this.tooltipController.show('请拖动鼠标确定半径,右键取消绘制');
        this.onMouseMove(); 
    } else if (this.points.length > 1) {
        this.finishDrawing();
    }
}


  onDoubleClick() {
    console.log('onDoubleClick...')
  }

  /**
   * Draw a shape based on mouse movement points during the initial drawing.
   */
  updateMovingPoint(cartesian: Cartesian3) {
    const tempPoints = [...this.points, cartesian];
    this.setGeometryPoints([...tempPoints]);
    this.drawPolygon();
  }

  /**
   * In edit mode, drag key points to update corresponding key point data.
   */
  updateDraggingPoint(cartesian: Cartesian3, index: number) {
    this.points[index] = cartesian;
    this.setGeometryPoints([...this.points]);
    this.drawPolygon();
  }

  drawPolygon() {
    if (!this.polygonEntity) {
        
      // 圆心位置使用 CallbackProperty 动态获取
      const getCenterPosition = new this.cesium.CallbackProperty(
          () => this.geometryPoints[0] || this.cesium.Cartesian3.ZERO, 
          false
      );

      // 半径计算也使用 CallbackProperty
      const getRadius = new this.cesium.CallbackProperty(() => {
          return this.geometryPoints.length >= 2 
              ? this.cesium.Cartesian3.distance(
                  this.geometryPoints[0], 
                  this.geometryPoints[1]
                )
              : 0;
      }, false);

        const style = this.style as PolygonStyle;
        this.polygonEntity = this.viewer.entities.add({
            position:getCenterPosition, // Center position
            ellipse: {
                semiMajorAxis: getRadius,
                semiMinorAxis: getRadius,
                material: style.material,
                outline: style.outline,
                outlineColor: style.outlineMaterial,
                outlineWidth: style.outlineWidth,
                height:undefined,
                extrudedHeight: undefined,
                heightReference: this.cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
    }
}


  generatePoints(center, radius) {
    let x, y, angle;
    const points = [];
    for (let i = 0; i <= 100; i++) {
      angle = (Math.PI * 2 * i) / 100;
      x = center[0] + radius * Math.cos(angle);
      y = center[1] + radius * Math.sin(angle);
      points.push([x, y]);
    }
    return points;
  }

  getPoints() {
    return this.points;
  }
}
