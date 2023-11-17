function Publish(formContext) {
    formContext.getAttribute("statecode").setValue(1);
    formContext.getAttribute("statuscode").setValue(121280001);
    formContext.data.refresh(true);
}
function Discontinue(formContext) {
    formContext.getAttribute("statecode").setValue(1);
    formContext.getAttribute("statuscode").setValue(2);
    formContext.data.refresh(true);
}
async function CreateRevision(formContext) {
    const schema = formContext.getAttribute('br_schema').getValue();
    const name = formContext.getAttribute('br_name').getValue();
    const template = formContext.getAttribute('br_template').getValue();
    let createRecordBody =
    {
        "br_name": name,
        "br_schema": schema,
    }
    if (template) {
        createRecordBody = {
            ...createRecordBody,
            "br_Template@odata.bind": "/br_templates(" +
                template[0].id.replace(/[{}]/g, '').toLowerCase() + ")"
        }
    }
    const result = await Xrm.WebApi.online.createRecord("br_form", createRecordBody);
    Xrm.Navigation.navigateTo({
        pageType: 'entityrecord',
        entityName: 'br_form',
        entityId: result.id
    });
}
function OpenForm() {
    alert('hello');
}