const enums = {}

enums.relation = RelationEnum = {
    Spouse: 'همسر',
    Children: 'فرزند',
    Father: 'پدر',
    Mother: 'مادر',
}

enums.state = StateEnum = {
    Initial: 'Initial',
    ShowInvoice: 'ShowInvoice',
    ShowRelation: 'ShowRelation', 
    Confirm: 'Confirm',
    Finished: 'Finished',
}

module.exports = enums;