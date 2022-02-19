const RelationEnum = {
    Spouse: 1,
    Children: 2,
    Father: 3,
    Mother: 4,
}

const StateEnum = {
    Initial: 0,
    InValid: 1,
    ShowInvoice: 2,
    Confirm: 3,
    Finished: 4,
    Add: 5,
    AddName: 6,
    AddFamily: 7,
    AddMeliCode: 8,
    AddRelation: 9,
    Added: 10,
    Delete: 11,
    Deleted: 12,
}

module.exports = { RelationEnum, StateEnum}