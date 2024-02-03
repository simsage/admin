import {configureMonacoYaml} from "monaco-yaml";

window.MonacoEnvironment = {
    getWorker(moduleId, label) {
        return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url));
    },
};

export function configureMonaco(monaco) {
    if (!monaco.initiated) {
        configureMonacoYaml(monaco, {
            enableSchemaRequest: true,
            schemas: [
                {
                    // If YAML file is opened matching this glob
                    fileMatch: ['sdc.yml'],
                    // The following schema will be applied
                    uri: window.ENV.api_base+ "/crawler/sdc_schema"
                },
                {
                    // If YAML file is opened matching this glob
                    fileMatch: ['processor.yml'],
                    // The following schema will be applied
                    uri: window.ENV.api_base+ "/crawler/processor_schema"
                }
            ]
        })
        monaco.initiated = true
    }

}