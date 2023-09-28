export class WebApi implements ComponentFramework.WebApi {
    createRecord(entityType: string, data: ComponentFramework.WebApi.Entity): ComponentFramework.LookupValue {
        return new LookupValue();
    }
    deleteRecord(entityType: string, id: string): Promise<ComponentFramework.LookupValue> {
        throw new Error("Method not implemented.");
    }
    updateRecord(entityType: string, id: string, data: ComponentFramework.WebApi.Entity): Promise<ComponentFramework.LookupValue> {
        throw new Error("Method not implemented.");
    }
    retrieveMultipleRecords(entityType: string, options?: string | undefined, maxPageSize?: number | undefined): ComponentFramework.WebApi.RetrieveMultipleResponse {
        return new RetrieveMultipleResponse();
    }
    retrieveRecord(entityType: string, id: string, options?: string | undefined): ComponentFramework.WebApi.Entity {
        return new Entity();
    }
}

export class Entity implements ComponentFramework.WebApi.Entity {
    
}

export class LookupValue implements ComponentFramework.LookupValue {
    id: string;
    name?: string | undefined;
    entityType: string;
}

export class RetrieveMultipleResponse implements ComponentFramework.WebApi.RetrieveMultipleResponse {
    entities: ComponentFramework.WebApi.Entity[] = [new Entity()]
    nextLink: string;
}