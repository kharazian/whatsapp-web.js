const util = require('./util')

const msgString = {
    CusIdCodeEnter : 'لطفا کد ملی بازنشسته را وارد فرمایید.',
    ReCusIdCodeEnter : 'لطفا کد ملی وابسته را وارد فرمایید.',
    CusRelEdited : 'بیمه تکمیلی {0} {1} با شماره ملی {2} {3} شد.',
    CusIdCodeNotFound : 'کد ملی {0} در سیستم یافت نشد خواهشمند است با شماره تلفن 03132121466 تماس حاصل فرمایید.',
    CusShowInvoiceTitle : 'بیمه تکمیلی {0} مربوط {1} {2} -- {3} به مبلغ {4} می باشد.',
    CusShowInvoiceFooter : 'مبلغ کل بیمه {0} ریال می باشد که به صورت اقساطی کم خواهد شد',
    CusShowInvoiceBody : '\nوابسته - {0} - {1} {2} بیمه تکمیلی {3} است با مبلغ {4} ریال .\n',
    CusShowRelTitle : 'بیمه تکمیلی {0} مربوط {1} {2} ',
    CusShowRelFooter : 'مبلغ بیمه برای این وابسته {0} ریال می باشد که به صورت اقساطی کم خواهد شد',
    CusShowRelBody : '\nوابسته - {0} - {1} {2} بیمه تکمیلی {3} است با مبلغ {4} ریال می باشد.\n',
    CusShowInvoiceBtnEnableAll : '*فعال کردن بیمه اصلی',
    CusShowInvoiceBtnDisableAll : '*غیرفعال کردن بیمه اصلی',
    CusShowInvoiceBtnEditRel : '*ویرایش وابسته',
    CusShowInvoiceBtnRetuen : '*بازگشت',
    CusShowInvoiceBtnPrint : '*چاپ',
    CusShowInvoiceBtnClose : '*بستن درخواست',
    CusShowInvoiceBtnEnableRel : '*فعال کردن بیمه وابسته',
    CusShowInvoiceBtnDisableRel : '*غیرفعال کردن بیمه وابسته',
    CusShowInvoiceBtnConfirm : '*تایید نهایی',
    EnableOrDisbale : x => x ? 'فعال' : 'غیرفعال',
}

module.exports = msgString;
