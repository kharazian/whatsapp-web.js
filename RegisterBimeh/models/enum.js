const enums = {}

enums.relation = RelationEnum = {
    Spouse: 1,
    Children: 2,
    Father: 3,
    Mother: 4,
}

enums.state = StateEnum = {
    Initial: 'Initial',
    InValid: 'InValid',
    ShowInvoice: 'ShowInvoice',
    Confirm: 'Confirm',
    Finished: 'Finished',
    Add: 'Add',
    AddName: 'AddName',
    AddFamily: 'AddFamily',
    AddMeliCode: 'AddMeliCode',
    AddRelation: 'AddRelation',
    Added: 'Added',
    RelEnable: 'RelEnable',
    RelDisable: 'RelDisable',
}

module.exports = enums;