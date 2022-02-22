const checkCodeMeli = function myfunction(codeMeli) {
    if (isNaN(codeMeli)) {
        return false;
    } else if (codeMeli == "") {
        return false;
    } else if (codeMeli.length > 10)  {
        return false;
    }
    else {
        codeMeli = codeMeli.padStart(10, "0");
        var yy = 0;
        var yv = 0;
        for (let i = 0; i < codeMeli.length; i++) {
            yv = codeMeli[i] * (codeMeli.length - i);
            yy += yv;
        }
        var x = yy % 11;
        if (x === 0) {
            return true;
        } else {
            return false;
        }
        yy = 0;
    }
}

module.exports = checkCodeMeli;