import { Viewer, ScreenSpaceEventHandler, ScreenSpaceEventType, Cartesian2 } from 'cesium';

interface TooltipOptions {
  containerId?: string;
  className?: string;
  offsetX?: number;
  offsetY?: number;
}

interface ShowOptions {
  x?: number;
  y?: number;
}

class CesiumTooltipController {
  private viewer: Viewer;
  private options: Required<TooltipOptions>;
  private mouseMoveHandler: ScreenSpaceEventHandler | null = null;
  private tooltipContainer: HTMLElement | null = null;

  /**
   * 构造函数
   * @param viewer Cesium 视图实例
   * @param options 配置选项
   */
  constructor(viewer: Viewer, options: TooltipOptions = {}) {
    this.viewer = viewer;
    this.options = {
      containerId: 'tooltip-container',
      className: 'cesium-tooltip',
      offsetX: 10,
      offsetY: 10,
      ...options
    };

    this._initTooltipContainer();
  }

  /**
   * 初始化工具提示容器
   * @private
   */
  private _initTooltipContainer(): void {
    let container = document.getElementById(this.options.containerId);
    
    if (!container) {
      container = document.createElement('div');
      container.id = this.options.containerId;
      container.className = this.options.className;
      
      // 设置默认样式
      Object.assign(container.style, {
        position: 'absolute',
        pointerEvents: 'none',
        display: 'none',
        zIndex: '9999',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        maxWidth: '300px',
        whiteSpace: 'nowrap',
        transition: 'opacity 0.2s ease-out'
      });
      
      this.viewer.container.appendChild(container);
    }
    
    this.tooltipContainer = container;
  }

  /**
   * 显示工具提示
   * @param content 要显示的内容(HTML字符串)
   * @param options 显示选项
   */
  public show(content: string, options: ShowOptions = {}): void {
    if (!this.tooltipContainer) return;

    this.tooltipContainer.innerHTML = content;
    this.tooltipContainer.style.display = 'block';

    if (options.x !== undefined && options.y !== undefined) {
      // 固定位置模式
      this._setPosition(options.x, options.y);
      this._removeMouseMoveHandler();
    } else {
      // 跟随鼠标模式
      this._setupMouseMoveHandler();
    }
  }

  /**
   * 设置鼠标移动处理器
   * @private
   */
  private _setupMouseMoveHandler(): void {
    if (this.mouseMoveHandler) return;

    this.mouseMoveHandler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.mouseMoveHandler.setInputAction((movement: { endPosition: Cartesian2 }) => {
      this._setPosition(movement.endPosition.x, movement.endPosition.y);
    }, ScreenSpaceEventType.MOUSE_MOVE);
  }

  /**
   * 移除鼠标移动处理器
   * @private
   */
  private _removeMouseMoveHandler(): void {
    if (this.mouseMoveHandler) {
      this.mouseMoveHandler.destroy();
      this.mouseMoveHandler = null;
    }
  }

  /**
   * 设置工具提示位置
   * @param x 屏幕X坐标
   * @param y 屏幕Y坐标
   * @private
   */
  private _setPosition(x: number, y: number): void {
    if (!this.tooltipContainer) return;

    const { offsetX, offsetY } = this.options;
    this.tooltipContainer.style.left = `${x + offsetX}px`;
    this.tooltipContainer.style.top = `${y + offsetY}px`;
  }

  /**
   * 隐藏工具提示
   */
  public hide(): void {
    if (this.tooltipContainer) {
      this.tooltipContainer.style.display = 'none';
    }
  }

  /**
   * 更新工具提示内容
   * @param content 新的内容(HTML字符串)
   */
  public update(content: string): void {
    if (this.tooltipContainer) {
      this.tooltipContainer.innerHTML = content;
    }
  }

  /**
   * 设置工具提示样式
   * @param styles CSS样式对象
   */
  public setStyle(styles: Partial<CSSStyleDeclaration>): void {
    if (!this.tooltipContainer) return;

    Object.assign(this.tooltipContainer.style, styles);
  }

  /**
   * 销毁工具提示控制器
   */
  public destroy(): void {
    this._removeMouseMoveHandler();
    
    if (this.tooltipContainer && this.tooltipContainer.parentNode) {
      this.tooltipContainer.parentNode.removeChild(this.tooltipContainer);
      this.tooltipContainer = null;
    }
    
    // @ts-ignore 帮助GC
    this.viewer = null;
  }
}

export default CesiumTooltipController;