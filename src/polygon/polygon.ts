/*
 * @Description: 
 * @Author: huangjiabin
 * @Date: 2025-04-09 15:35:01
 * @LastEditTime: 2025-04-09 16:49:22
 * @LastEditors: huangjiabin
 */
import Base from '../base';
// @ts-ignore
import { Cartesian3 } from 'cesium';

import { PolygonStyle } from '../interface';

export default class Polygon extends Base {
  points: Cartesian3[] = [];

  constructor(cesium: any, viewer: any, style?: PolygonStyle) {
    super(cesium, viewer, style, 'Polygon');
    this.cesium = cesium;
    this.setState('drawing');
    this.onDoubleClick();
  }
  //重写双击方法
  onDoubleClick() {
    this.eventHandler.setInputAction((evt: any) => {
      //当双击时检查当前的点数
      if (this.className === 'Polygon' && this.points.length < 3) {
        this.tooltipController.show('点数不足，请至少绘制 3 个点以完成多边形绘制。')
        this.tooltipController.setStyle({
          color: 'red'
        })
        setTimeout(() => {
          if (this && this.tooltipController) {
            this.tooltipController.show('双击结束绘制')
            this.tooltipController.setStyle({
              color: 'white'
            })
          }
        }, 1000)
        // 获取当前类的名称
        return;
      }

      if (this.state === 'drawing') {
        this.finishDrawing();
        //完成绘制,销毁提示框
        this.tooltipController.destroy();
      }
    }, this.cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

  }

  getType(): 'polygon' | 'line' {
    return 'polygon';
  }

  /**
   * Add points only on click events
   */
  addPoint(cartesian: Cartesian3) {
    this.points.push(cartesian);
    if (this.points.length === 1) {
      this.onMouseMove();
    }
  }

  /**
   * Draw a shape based on mouse movement points during the initial drawing.
   */
  updateMovingPoint(cartesian: Cartesian3) {
    const tempPoints = [...this.points, cartesian];
    this.setGeometryPoints(tempPoints);
    if (tempPoints.length === 2) {
      this.addTempLine();
    } else {
      this.removeTempLine();
      this.drawPolygon();
    }
  }

  /**
   * In edit mode, drag key points to update corresponding key point data.
   */
  updateDraggingPoint(cartesian: Cartesian3, index: number) {
    this.points[index] = cartesian;
    this.setGeometryPoints(this.points);
    this.drawPolygon();
  }

  getPoints() {
    return this.points;
  }
}
