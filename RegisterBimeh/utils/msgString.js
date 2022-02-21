const util = require('./util')

const msgString = {
    CustomerIdentityCodeEnter : 'لطفا کد ملی بازنشسته را وارد فرمایید.',
    CustomerIdentityCodeEnterRelationEnable : 'لطفا کد ملی وابسته {0} {1} را جهت فعال شدن وارد فرمایید.',
    CustomerIdentityCodeEnterRelationDisable : 'لطفا کد ملی وابسته {0} {1} را جهت غیرفعال شدن وارد فرمایید.',
    CustomerRelationEdited : 'بیمه تکمیلی {0} {1} با شماره ملی {2} {3} شد.',
    CustomerIdentityCodeNotFound : 'کد ملی {0} در سیستم یافت نشد خواهشمند است با شماره تلفن 03132121466 تماس حاصل فرمایید.',
    CustomerRegisterFinished : 'ّیمه تکمیلی برای کد ملی {0} {1} {2} تایید نهایی شده است و امکان تغییر وجود ندارد. در صورت درخواست تغییر با شماره 03132121466 تماس حاصل فرمایید.',
    CustomerShowInvoiceTitle : 'بیمه تکمیلی {0} مربوط {1} {2} -- {3} به مبلغ {4} می باشد.',
    CustomerShowInvoiceFooter : 'مبلغ کل بیمه {0} ریال می باشد که به صورت اقساطی کم خواهد شد',
    CustomerShowInvoiceBody : '----------\nوابسته - {0} - {1} {2} بیمه تکمیلی {3} است با مبلغ {4} ریال \n.',
    CustomerShowInvoiceBtnConfirm : '*تایید نهایی',
    CustomerShowInvoiceBtnEnableAll : '*فعال کردن بیمه',
    CustomerShowInvoiceBtnDisableAll : '*غیرفعال کردن بیمه',
    CustomerShowInvoiceBtnAddNewRelation : '*وابسته جدید',
    CustomerShowInvoiceBtnEnableRealtion : '*فعال کردن وابسته',
    CustomerShowInvoiceBtnDisableRelation : '*غیرفعال کردن وابسته',
    EnableOrDisbale : x => x ? 'فعال' : 'غیرفعال',
}

module.exports = msgString;
