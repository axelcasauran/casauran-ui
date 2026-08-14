import {
  createVirtualAxis,
  type VirtualAxis,
  type VirtualAxisOptions,
  type VirtualWindow,
} from './axis.js';

export interface VirtualGridOptions {
  readonly rowCount: number;
  readonly columnCount: number;
  readonly estimateRowSize: VirtualAxisOptions['estimateSize'];
  readonly estimateColumnSize: VirtualAxisOptions['estimateSize'];
  readonly getRowKey?: VirtualAxisOptions['getKey'];
  readonly getColumnKey?: VirtualAxisOptions['getKey'];
  readonly rowOverscan?: VirtualAxisOptions['overscan'];
  readonly columnOverscan?: VirtualAxisOptions['overscan'];
}

export interface VirtualGridWindowOptions {
  readonly scrollTop: number;
  readonly scrollLeft: number;
  readonly viewportHeight: number;
  readonly viewportWidth: number;
  readonly includeRowIndexes?: readonly number[];
  readonly includeColumnIndexes?: readonly number[];
}

export interface VirtualGridWindow {
  readonly rows: VirtualWindow;
  readonly columns: VirtualWindow;
  readonly totalHeight: number;
  readonly totalWidth: number;
}

export interface VirtualGrid {
  readonly rows: VirtualAxis;
  readonly columns: VirtualAxis;
  getWindow(options: VirtualGridWindowOptions): VirtualGridWindow;
}

export const createVirtualGrid = (options: VirtualGridOptions): VirtualGrid => {
  const rows = createVirtualAxis({
    count: options.rowCount,
    estimateSize: options.estimateRowSize,
    ...(options.getRowKey === undefined ? {} : { getKey: options.getRowKey }),
    ...(options.rowOverscan === undefined ? {} : { overscan: options.rowOverscan }),
  });
  const columns = createVirtualAxis({
    count: options.columnCount,
    estimateSize: options.estimateColumnSize,
    ...(options.getColumnKey === undefined ? {} : { getKey: options.getColumnKey }),
    ...(options.columnOverscan === undefined ? {} : { overscan: options.columnOverscan }),
  });
  const grid: VirtualGrid = {
    rows,
    columns,
    getWindow(windowOptions: VirtualGridWindowOptions) {
      const rowWindow = rows.getWindow({
        offset: windowOptions.scrollTop,
        viewportSize: windowOptions.viewportHeight,
        ...(windowOptions.includeRowIndexes === undefined
          ? {}
          : { includeIndexes: windowOptions.includeRowIndexes }),
      });
      const columnWindow = columns.getWindow({
        offset: windowOptions.scrollLeft,
        viewportSize: windowOptions.viewportWidth,
        ...(windowOptions.includeColumnIndexes === undefined
          ? {}
          : { includeIndexes: windowOptions.includeColumnIndexes }),
      });
      return Object.freeze({
        rows: rowWindow,
        columns: columnWindow,
        totalHeight: rowWindow.totalSize,
        totalWidth: columnWindow.totalSize,
      });
    },
  };
  return Object.freeze(grid);
};
