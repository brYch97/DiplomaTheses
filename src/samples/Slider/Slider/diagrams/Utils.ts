export class Utils implements ComponentFramework.Utility {
    getEntityMetadata(entityName: string, attributes?: string[] | undefined): ComponentFramework.PropertyHelper.EntityMetadata {
        throw new Error("Method not implemented.");
    }
    hasEntityPrivilege(entityName: string, privilegeType: ComponentFramework.PropertyHelper.Types.PrivilegeType, privilegeDepth: ComponentFramework.PropertyHelper.Types.PrivilegeDepth): boolean {
        throw new Error("Method not implemented.");
    }
    lookupObjects(lookupOptions: ComponentFramework.UtilityApi.LookupOptions): Promise<ComponentFramework.LookupValue[]> {
        throw new Error("Method not implemented.");
    }
}

class EntityMetadata implements ComponentFramework.PropertyHelper.EntityMetadata {

}