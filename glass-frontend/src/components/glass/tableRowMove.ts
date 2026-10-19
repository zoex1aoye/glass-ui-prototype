import type { TableRowData } from 'tdesign-vue-next'

export type GlassTableRowMoveDirection = 'up' | 'down'

export interface GlassTableRowMoveContext<T extends TableRowData = TableRowData> {
  /** 被移动的行 */
  row: T
  /** 移动前行索引（0-based） */
  rowIndex: number
  /** 目标行索引（0-based） */
  targetIndex: number
  direction: GlassTableRowMoveDirection
  /** 已重排的新数组；调用方原样回写即可 */
  newData: T[]
}

/**
 * 返回重排后的新数组，不修改传入数据。
 * 索引越界或原地移动时返回原数据的浅拷贝。
 */
export function moveTableRow<T>(data: readonly T[], from: number, to: number): T[] {
  const next = [...data]
  if (
    from < 0 ||
    from >= next.length ||
    to < 0 ||
    to >= next.length ||
    from === to
  ) {
    return next
  }

  const [row] = next.splice(from, 1)
  next.splice(to, 0, row)
  return next
}
