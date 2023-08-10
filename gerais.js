window.showModalDialog = window.showModalDialog || function (url, arg, opt) {
    url = url || '';
    arg = arg || null;
    opt = opt || 'dialogWidth: 300px; dialogHeight: 200px;';

    var caller = showModalDialog.caller.toString();
    var dialog = document.body.appendChild(document.createElement('div'));
    var dialogBg = document.body.appendChild(document.createElement('div'));

    dialog.className = 'dialog';
    dialogBg.className = 'dialog-background';

    opt = opt.split(';');

    for (var i = 0; i < opt.length; i++) {
        var regexTrim = /^\s+|\s+$/;

        if (!opt[i].replace(regexTrim, '')) {
            break;
        }

        var arr = opt[i].split(':');

        var name = arr[0].replace(regexTrim, '').replace(/dialog/gi, '').toLowerCase();
        var value = arr[1].replace(regexTrim, '');

        if (name === 'scroll' || name === 'status' || name === 'help' || name === 'resizable') {
            continue;
        }

        dialog.style[name] = value;
    }

    dialog.innerHTML = '<a id="dialog-close" href="#" style="position: absolute; left: 100%; margin-left: -17px; color: black; text-decoration: none;">X</a>' +
                       '<iframe id="dialog-iframe" src="' + url + '" style="border: 0; width: 100%; height: 100%;"></iframe>';

    var dialogFrame = document.getElementById('dialog-iframe');
    var dialogClose = document.getElementById('dialog-close');

    dialogFrame.contentWindow.dialogArguments = arg;

    var isNext = false;
    var stmts = caller.split('\n');
    var nextStmts = [];

    for (var i = 0; i < stmts.length; i++) {
        if (isNext || stmts[i].indexOf('showModalDialog(') >= 0) {
            nextStmts.push(stmts[i]);
            isNext = true;
        }
    }

    dialogFrame.contentWindow.close = function () {
        var returnValue = dialogFrame.contentWindow.returnValue;
        var regexReturn = /return (\w|\d)+;/g;

        document.body.removeChild(dialog);
        document.body.removeChild(dialogBg);

        nextStmts[0] = nextStmts[0].replace(/(window\.)?showModalDialog\(.*\)/g, '"' + returnValue + '"');

        eval('{\n' + nextStmts.join('\n').replace(regexReturn, ''));
    };

    dialogClose.addEventListener('click', function (e) {
        e.preventDefault();
        dialogFrame.contentWindow.close();
    });

    throw 'Execution stopped until showModalDialog is closed';
};

var oldShowModalDialog = window.showModalDialog;

window.showModalDialog = function (url, args, opt) {
    var options = opt;
    var idx;

    // Pega tamanho da tela
    var x = screen.availWidth;
    var y = screen.availHeight;

    // Pega largura da janela
    idx = options.indexOf("dialogWidth:", 0) + "dialogWidth:".length;

    var lar = options.substring(idx, options.indexOf("px", idx));

    // Pega altura da janela
    idx = options.indexOf("dialogHeight:", 0) + "dialogHeight:".length;

    var alt = options.substring(idx, options.indexOf("px", idx));

    //Se for 0 é pq é o tamanho máximo
    if (lar == 0) {
        lar = x;

        options = options.replace("dialogWidth:0px;", "");
        options = options + "dialogWidth:" + lar + "px;";
    }

    if (alt == 0) {
        alt = y;

        options = options.replace("dialogHeight:0px;", "");
        options = options + "dialogHeight:" + alt + "px;";
    }

    // Calcula posicoes
    x = (x - lar) / 2;
    y = (y - alt) / 2;

    // Adiciona opcoes das coordenadas
    options = 'dialogLeft:' + x + 'px; dialogTop:' + y + 'px; ' + options;

    // Chama o metodo antigo
    return oldShowModalDialog(url, args, options);
}

function MascaraHora(txt, e) {
    var ascii = getKeyCode(e);
    
    if ((ascii >= 48 && ascii <= 57) || (ascii >= 96 && ascii <= 105)) {
        if (txt.value.length == 2 && !isNaN(txt.value)) {
            var hora = txt.value;

            if (hora >= "00" && hora <= "24") {
                txt.value += ":";
            }
        }

        if (txt.value.length == 3 && !isNaN(txt.value)) {
            var hora = txt.value.substr(0, 2);

            if (hora >= "00" && hora <= "24") {
                txt.value = hora + ":" + txt.value.substr(2, 1);
            }
        }
    }
}

function getKeyCode(e) {
    if (!e) {
        if (window.event) {
            //Internet Explorer
            e = window.event;
        } else {
            return 0;
        }
    }
    if (typeof (e.keyCode) == 'number') {
        //DOM
        return e.keyCode;
    } else if (typeof (e.which) == 'number') {
        //NS 4 compatible
        return e.which;
    } else if (typeof (e.charCode) == 'number') {
        //also NS 6+, Mozilla 0.9+
        return e.charCode;
    } else {
        //total failure, we have no way of obtaining the key code
        return 0;
    }
}

function somenteNum(s) {
    var ret = "";
    
    for (var i = 0; i < s.length; i++) {
        if (!isNaN(s.substr(i, 1))) ret += s.substr(i, 1);
    }

    return ret;
}

function horaSoma(minutos, deci) {
    if (deci) return minutos.toString();

    var ret = "";
    var aux = minutos % 60;

    if (minutos < 0 && (minutos % 60 != 0)) {
        ret = formata(Math.floor(minutos / 60) + 1, 2) + ":" + formata(Math.floor(Math.abs(aux)), 2);
    } else {
        ret = formata(Math.floor(minutos / 60), 2) + ":" + formata(Math.floor(Math.abs(aux)), 2);
    }

    if (minutos < 0 && (ret.substr(0, 1) != "-")) ret = "-" + ret;

    return ret;
}

function minutoSoma(hora) {
    if (hora == "") {
        return 0;
    } else {
        var pos = hora.indexOf(":");

        if (pos == -1) {
            return eval(hora.replace(",", "."));
        }

        var ret = 0;

        if (!isNaN(hora.substr(0, pos))) {
            ret = eval(hora.substr(0, pos)) * 60;

            if (!isNaN(hora.substr(hora.length - 2, 2))) {
                if (hora.substr(0, 1) == "-") {
                    ret -= eval(hora.substr(hora.length - 2, 2));
                } else {
                    ret += eval(hora.substr(hora.length - 2, 2));
                }
            }
        }

        return ret;
    }
}

function horaReduzida(minutos, decimal, reduzida) {
    var ret;
    var aux;
    var negativo = false;

    if (decimal) return minutos;

    if (reduzida == 60) {
        return horaSoma(minutos, false);
    }

    if (minutos < 0) {
        negativo = true;
        minutos = minutos * -1;
    }

    aux = minutos / reduzida;
    ret = Math.floor(aux);

    aux = aux - ret;
    aux = Math.floor(aux * 60);

    ret = formata(ret, 2) + ":" + formata(aux, 2);
    if (negativo) ret = "-" + ret;

    return ret;
}

function ehHora(hora) {
    var hor = hora.substr(0, 2);
    var min = hora.substr(3, 2);

    if (isNaN(hor)) return false;
    if (isNaN(min)) return false;

    if (hor < 0 || hor > 23) return false;
    if (min < 0 || min > 59) return false;

    return true;
}

function formata(numero, casas) {
    var ret = "";

    numero = numero.toString();

    for (var i = 0; i < casas - numero.length; i++) {
        ret += 0;
    }

    ret += numero;

    return ret;
}

function formataDecimal(numero, casas) {
    numero = numero.toString().replace(".", ",");

    if (numero.indexOf(",") == -1) return numero;

    numero = numero.substr(0, numero.indexOf(",") + casas + 1)

    for (var i = 0; i < (numero.indexOf(",") + casas + 1) - numero.length; i++) numero += "0";

    return numero;
}