export namespace FormRecognizer {
    export interface ILayoutStructure {
        tables: ITable[]
        paragraphs: IParagraph[]
    }

    export interface ITable {
        rowCount: number
        columnCount: number
        cells: ICell[]
        boundingRegions: IBoundingRegion[]
        spans: ISpan[]
    }

    export interface ICell {
        kind?: string
        rowIndex: number
        columnIndex: number
        columnSpan?: number
        content: string
        boundingRegions: IBoundingRegion[]
        spans: ISpan[]
    }

    export interface IBoundingRegion {
        pageNumber: number
        polygon: number[]
    }

    export interface ISpan {
        offset: number
        length: number
    }
    export interface IParagraph {
        spans: ISpan[]
        boundingRegions: IBoundingRegion[]
        role?: string
        content: string
    }
}
