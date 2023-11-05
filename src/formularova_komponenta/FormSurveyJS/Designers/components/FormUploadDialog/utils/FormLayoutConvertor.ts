import { FormRecognizer } from "../../../../interfaces/IFormLayoutStructure";
import { ISchema, ISchemaElement, InputType, QuestionType } from "../../../../interfaces/ISchema";
import { BoundingRegionUtils } from "./BoundingRegionUtils";

interface ITable {
    boundingRegion: FormRecognizer.IBoundingRegion,
    cellBoundingRegions: FormRecognizer.IBoundingRegion[],
    tableSchemaElement: ISchemaElement
}

export interface IExtendedSchemaElement extends ISchemaElement {
    boundingRegion: FormRecognizer.IBoundingRegion;
    pageNumber: number
}

export class FormLayoutConvertor {
    public static toSchema(formLayoutStructure: FormRecognizer.ILayoutStructure) {
        const schema: ISchema = {
            pages: [] as any
        };
        const tables = FormLayoutConvertor._getTables(formLayoutStructure);
        FormLayoutConvertor._injectFieldSchemaElements(schema, formLayoutStructure.paragraphs, tables.flatMap(table => table.cellBoundingRegions));
        FormLayoutConvertor._injectTableSchemaElements(schema, tables);
        return schema;
    }
    private static _injectTableSchemaElements = (schema: ISchema, tables: ITable[]) => {
        for (const table of tables) {
            const elements = schema.pages?.flatMap(page => page.elements);
            if (!elements || elements.length === 0) {
                return;
            }
            const nearest = BoundingRegionUtils.findNearestSchemaElement(table.boundingRegion, schema.pages?.flatMap(page => page.elements) as IExtendedSchemaElement[])
            const index = elements.indexOf(nearest as ISchemaElement);
            try {
                const pageElements = schema.pages![nearest?.pageNumber! - 1].elements;
                pageElements?.splice(Math.min(index! + 1, pageElements.length - 1), 0, table.tableSchemaElement)
            }
            catch (err) {
                console.error(err);
            }
        }
    }
    private static _injectFieldSchemaElements = (schema: ISchema, paragraphs: FormRecognizer.IParagraph[], tableCellBoundingRegions: FormRecognizer.IBoundingRegion[]) => {
        let index = 1;
        for (const paragraph of paragraphs) {
            let shouldContinue = false;
            const paragraphBoundingRegion = paragraph.boundingRegions[0];
            if (paragraph.role === 'title') {
                schema.title = paragraph.content;
                shouldContinue = true;
            }
            for (const boundingRegion of tableCellBoundingRegions) {
                if (boundingRegion.polygon.sort().join(',') === paragraphBoundingRegion.polygon.sort().join(',') && boundingRegion.pageNumber === paragraphBoundingRegion.pageNumber) {
                    shouldContinue = true;
                    break;
                }
            }
            if (shouldContinue) {
                continue;
            }
            const schemaElement: IExtendedSchemaElement = {
                name: `question${index}`,
                title: paragraph.content,
                type: FormLayoutConvertor._getQuestionType(paragraph.content),
                inputType: FormLayoutConvertor._getQuestionInputType(paragraph.content),
                boundingRegion: paragraph.boundingRegions[0],
                pageNumber: paragraph.boundingRegions[0].pageNumber
            }
            index++;
            FormLayoutConvertor._pushSchemaElementToPage(schema, schemaElement, paragraph);
        }
    }
    private static _pushSchemaElementToPage(schema: ISchema, schemaElement: ISchemaElement, paragraph: FormRecognizer.IParagraph) {
        const pageNumber = paragraph.boundingRegions[0].pageNumber;
        let page = schema.pages?.find(page => page.name === `Page ${pageNumber}`);
        if (!page) {
            page = {
                name: `Page ${pageNumber}`,
                elements: [schemaElement]
            }
            schema.pages?.push(page);
            return;
        }
        page.elements?.push(schemaElement);
    }
    private static _getTables(formLayoutStructure: FormRecognizer.ILayoutStructure): ITable[] {
        const tables: ITable[] = [];
        let index = 1;
        for (const table of formLayoutStructure.tables) {
            let cells = table.cells.filter(cell => cell.kind === 'columnHeader');
            let title;
            const topLevelCells = cells.filter(cell => cell.rowIndex === 0);
            if (topLevelCells.length === 1) {
                cells = cells.filter(cell => cell.rowIndex !== 0);
                title = topLevelCells[0].content;
            }

            const tableSchemaElement: ISchemaElement = {
                type: QuestionType.MatrixDynamic,
                name: `table${index}`,
                title: title ?? `Tabulka ${index}`,
                cellType: 'text',
                rowCount: 1,
                columns: cells.map(cell => {
                    return {
                        name: cell.content
                    };
                })
            }
            tables.push({
                boundingRegion: table.boundingRegions[0],
                cellBoundingRegions: table.cells.map(cell => cell.boundingRegions[0]),
                tableSchemaElement: tableSchemaElement
            })
            index++;
        }
        return tables;
    }
    private static _getQuestionType = (title: string): QuestionType => {
        title = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        if (title.includes('podpis')) {
            return QuestionType.SignaturePad
        }
        return QuestionType.Text;
    }
    private static _getQuestionInputType = (title: string): InputType | undefined => {
        title = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        if (title.includes('datum') || title.includes('platnost')) {
            return InputType.Date
        }
        if (title.includes('telefon')) {
            return InputType.Tel;
        }
        if (title.includes('mail')) {
            return InputType.Email;
        }
        return undefined;
    }
}

