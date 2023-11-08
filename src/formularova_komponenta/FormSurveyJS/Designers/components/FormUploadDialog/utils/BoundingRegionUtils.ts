import { FormRecognizer } from "../../../../interfaces/IFormLayoutStructure";
import { IExtendedSchemaElement } from "./FormLayoutConvertor";

/**
 * Class for handling bounding region related operations.
 */
export class BoundingRegionUtils {
    /**
     * Finds the nearest schema element to the source bounding region.
     * @param {FormRecognizer.IBoundingRegion} sourceBoundingRegion - The source bounding region.
     * @param {IExtendedSchemaElement[]} schemaElements - The array of schema elements.
     * @returns {IExtendedSchemaElement | null} - The nearest schema element or null if not found.
     */
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
    /**
  * Calculates the midpoint of a polygon.
  * @param {number[]} polygon - The array of points representing the polygon.
  * @returns {[number, number]} - The coordinates of the midpoint.
  */
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
    /**
 * Calculates the Euclidean distance between two points.
 * @param {[number, number]} point1 - The first point.
 * @param {[number, number]} point2 - The second point.
 * @returns {number} - The Euclidean distance between the two points.
 */
    private static calculateEuclideanDistance(point1: [number, number], point2: [number, number]): number {
        const dx = point2[0] - point1[0];
        const dy = point2[1] - point1[1];

        return Math.sqrt(dx * dx + dy * dy);
    }
}