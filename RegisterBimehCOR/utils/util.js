String.prototype.format = function () {
    // store arguments in an array
    var args = arguments;
    // use replace to iterate over the string
    // select the match and check if related argument is present
    // if yes, replace the match with the argument
    return this.replace(/{([0-9]+):?([0-9]*)}/g, function (match, index, pad) {
      // check if the argument is present
      return typeof args[index] == 'undefined' ? match : args[index].toString().padEnd(Number(pad)," ");
    });
  };
  //   console.log('{0} is {1:10} years old and likes {2}'.format('John', 30, 'pizza'));

  String.prototype.numEnglish = function () {
    return this.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
              .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  };

  Number.prototype.numSeparator = function () {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  