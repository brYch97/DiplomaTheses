import { FormRecognizer } from "../../../../interfaces/IFormLayoutStructure";
import { IExtendedSchemaElement } from "./FormLayoutConvertor";

/**
 * Class for handling bounding region related operations.
 */
export class BoundingRegionUtils {
    public static findNearestSchemaElement(sourceBoundingRegion: FormRecognizer.IBoundingRegion, schemaElements: IExtendedSchemaElement[]): IExtendedSchemaElement | null {
        const sourceMidpoint = BoundingRegionUtils.calculatePolygonMidpoint(sourceBoundingRegion.polygon);

        let nearestBoundingRegion: FormRecognizer.IBoundingRegion | null = null;
        let nearestDistance = Number.MAX_VALUE;
        let nearestSchemaElement: IExtendedSchemaElement | null = null;

        for (const schemaElement of schemaElements) {
            const region = schemaElement.boundingRegion;
            if (!region) {
                return schemaElement;
            }
            const midpoint = BoundingRegionUtils.calculatePolygonMidpoint(region.polygon);
            const distance = BoundingRegionUtils.calculateEuclideanDistance(sourceMidpoint, midpoint);

            if ((distance < nearestDistance) && sourceBoundingRegion.pageNumber === schemaElement.pageNumber) {
                nearestDistance = distance;
                nearestBoundingRegion = region;
                nearestSchemaElement = schemaElement
            }
        }

        return nearestSchemaElement;
    }
    private static calculatePolygonMidpoint(polygon: number[]): [number, number] {
        let xSum = 0;
        let ySum = 0;

        for (let i = 0; i < polygon.length; i += 2) {
            xSum += polygon[i];
            ySum += polygon[i + 1];
        }

        const xMidpoint = xSum / (polygon.length / 2);
        const yMidpoint = ySum / (polygon.length / 2);

        return [xMidpoint, yMidpoint];
    }
    private static calculateEuclideanDistance(point1: [number, number], point2: [number, number]): number {
        const dx = point2[0] - point1[0];
        const dy = point2[1] - point1[1];

        return Math.sqrt(dx * dx + dy * dy);
    }
}