const util = require('./util')

const msgString = {
    CusCommandCodeMeli : 'کد ملی فرد وجود ندارد.',
    CusCommandRelCodeMeli : 'کد ملی وابسته وجود ندارد.',
    CusCommandWrongCommand : 'دستور درست نیست.',
    CusCommandfinished : 'اصلاح شد.',
    CusIdCodeEnter : 'لطفا کد ملی بازنشسته را وارد فرمایید.',
    ReCusIdCodeEnter : 'لطفا کد ملی وابسته را وارد فرمایید.',
    CusRelEdited : 'بیمه تکمیلی {0} {1} با شماره ملی {2} {3} شد.',
    CusIdCodeNotFound : 'کد ملی {0} در سیستم یافت نشد خواهشمند است با شماره تلفن 03132121466 تماس حاصل فرمایید.',
    CusShowInvoiceTitle : 'بیمه تکمیلی {0} مربوط {1} {2} -- {3} به مبلغ {4} می باشد.',
    CusShowInvoiceFooter : 'مبلغ کل بیمه {0} ریال می باشد که به صورت اقساطی کم خواهد شد',
    CusShowInvoiceBody : '\nوابسته - {0:10} - {1:11} {2:30} بیمه تکمیلی {3:8} است با مبلغ {4:12} ریال .\n',
    CusShowRelTitle : '{0} {1} {2} ',
    CusShowRelFooter : 'مبلغ بیمه برای این وابسته {0} ریال می باشد که به صورت اقساطی کم خواهد شد',
    CusShowRelBody : '\nوابسته - {0} - {1} {2} بیمه تکمیلی {3} است با مبلغ {4} ریال می باشد.\n',
    CusShowInvoiceBtnEnableAll : '*4 فعال کردن بیمه اصلی',
    CusShowInvoiceBtnDisableAll : '*0 غیرفعال کردن بیمه اصلی',
    CusShowInvoiceBtnEditRel : '*1 ویرایش وابسته',
    CusShowInvoiceBtnRetuen : '*9 بازگشت',
    CusShowInvoiceBtnPrint : '*5 چاپ',
    CusShowInvoiceBtnClose : '*3 بستن درخواست',
    CusShowInvoiceBtnEnableRel : '*6 فعال کردن بیمه وابسته',
    CusShowInvoiceBtnDisableRel : '*7 غیرفعال کردن بیمه وابسته',
    CusShowInvoiceBtnConfirm : '*2 تایید نهایی',
    CusShowNoRel : 'وابسته وجود ندارد',
    EnableOrDisbale : x => x ? '*فعال*' : '*غیرفعال*',
}

module.exports = msgString;
