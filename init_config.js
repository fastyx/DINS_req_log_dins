const path = require('path');

let config = {};
const ENV_PREFIX = 'LOGREQDINS';



// Читаем конфиг-файлы на основе переменной окружения NODE_ENV
if (process.env.NODE_ENV) {
    config = require(`./config/config.${process.env.NODE_ENV}.json`);
}
else {
    config = require('./config/config.json');
}
// Обновляем конфиг на основе значений переменных окружения
for (const envVar in process.env) {
    if (!envVar || !envVar.startsWith(`${ENV_PREFIX}_`)) {
        continue;
    }
    //console.log(`Env var ${envVar} = ${process.env[envVar]}`)
    const envVarPart = envVar.substring(ENV_PREFIX.length + 1);
    const parts = envVarPart.split('_');
    let cfg = config;
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!cfg[part]) {
            cfg[part] = {};
        }
        // Если конфиг - массив, то через переменные окружения заменяем первый элемент массив, остальные - удаляем
        if (Array.isArray(cfg[part])) {
            if (cfg[part].length == 0) {
                cfg[part] = [{}];
            }
            else if (cfg[part].length > 1) {
                cfg[part] = [cfg[part][0]];
            }
            cfg = cfg[part][0];
        }
        else {
            cfg = cfg[part];
        }
    }

    if (Array.isArray(cfg[parts[parts.length - 1]])) {
        cfg[parts[parts.length - 1]] = [process.env[envVar]];
    }
    else {
        cfg[parts[parts.length - 1]] = process.env[envVar];
    }
}

config.getFileRealPath = function (filePath) {
    if (!filePath || path.isAbsolute(filePath)) {
        return filePath;
    }
    return path.join(process.env.NODE_APP_PATH, filePath);
}

//console.log(`config: ${JSON.stringify(config, null, 4)}`);

module.exports = config;
