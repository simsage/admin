import React, {useState} from "react";
import "../../../css/code.css"
import {useSelector} from "react-redux";
import Api from "../../../common/api";

const compose = "version: \"3.9\"\n" +
    "services:\n" +
    "  web:\n" +
    "    image: simsage/external-crawler:<version>\n" +
    "    deploy:\n" +
    "      resources:\n" +
    "        limits:\n" +
    "          cpus: \"1\"\n" +
    "          memory: 4096M\n" +
    "        reservations:\n" +
    "          cpus: \"1\"\n" +
    "          memory: 2048M\n" +
    "    environment:\n" +
    "     - api_version=1\n" +
    "     - crawler_type=<ct>\n" +
    "     - source_id=<source>\n" +
    "     - organisation_id=<org>\n" +
    "     - kb_id=<kb>\n" +
    "     - exit_after_crawl=false\n" +
    "     - external_crawler_use_encryption=true\n" +
    "     - sid=<sid>\n" +
    "     - max_errors=0\n" +
    "     - external_crawler_cmd_timeout_in_seconds=60\n" +
    "     - exit_after_crawl=false\n" +
    "     - shared_secret_salt=<secret>\n" +
    "     - simsage_endpoint=<server>\n";

const docker = "docker run -d --name crawler-<source> --net=host --restart always \\\n" +
    "     -e api_version=1 \\\n" +
    "     -e crawler_type=<ct> \\\n" +
    "     -e source_id=<source> \\\n" +
    "     -e organisation_id=<org>  \\\n" +
    "     -e kb_id=<kb> \\\n" +
    "     -e sid=<sid>  \\\n" +
    "     -e shared_secret_salt=<secret> \\\n" +
    "     -e simsage_endpoint=<server>  \\\n" +
    "     -e exit_after_crawl=false  \\\n" +
    "     -e external_crawler_use_encryption=true  \\\n" +
    "     -e max_errors=0  \\\n" +
    "     -e external_crawler_cmd_timeout_in_seconds=60  \\\n" +
    "     -e exit_after_crawl=false  \\\n" +
    "     --memory=2g --memory-reservation=1536m \\\n" +
    "     simsage/external-crawler:<version>\n";

const bash = "#!/bin/bash\n" +
    "\n" +
    "if [ \"$JAVA_HOME\" == \"\" ]; then\n" +
    "  echo \"JAVA_HOME not set\"\n" +
    "  exit 1\n" +
    "fi\n" +
    "\n" +
    "export crawler_type=<ct>\n" +
    "export organisation_id=<org>\n" +
    "export kb_id=<kb>\n" +
    "export sid=<sid>\n" +
    "export source_id=<source>\n" +
    "export shared_secret_salt=<secret>\n" +
    "export api_version=1\n" +
    "export max_errors=0\n" +
    "export external_crawler_use_encryption=true\n" +
    "export external_crawler_cmd_timeout_in_seconds=60\n" +
    "export exit_after_crawl=false\n" +
    "# SimSage location\n" +
    "export simsage_endpoint=<server>\n" +
    "\n" +
    "rp=$(realpath \"$0\")\n" +
    "HOME=$(dirname \"$rp\")\n" +
    "CP=`echo $HOME/lib/*.jar | tr ' ' ':'`\n" +
    "$JAVA_HOME/bin/java \\\n" +
    "    -Djdk.attach.allowAttachSelf=true \\\n" +
    "    --add-modules java.se \\\n" +
    "    --add-exports java.base/jdk.internal.misc=ALL-UNNAMED \\\n" +
    "    --add-exports java.base/jdk.internal.ref=ALL-UNNAMED \\\n" +
    "    --add-exports java.base/sun.nio.ch=ALL-UNNAMED \\\n" +
    "    --add-exports java.management.rmi/com.sun.jmx.remote.internal.rmi=ALL-UNNAMED \\\n" +
    "    --add-exports java.rmi/sun.rmi.registry=ALL-UNNAMED \\\n" +
    "    --add-exports java.rmi/sun.rmi.server=ALL-UNNAMED \\\n" +
    "    --add-exports java.sql/java.sql=ALL-UNNAMED \\\n" +
    "    --add-opens java.base/java.io=ALL-UNNAMED \\\n" +
    "    --add-opens java.base/java.lang=ALL-UNNAMED \\\n" +
    "    --add-opens java.base/java.nio=ALL-UNNAMED \\\n" +
    "    --add-opens java.base/java.lang.module=ALL-UNNAMED \\\n" +
    "    --add-opens java.base/jdk.internal.loader=ALL-UNNAMED \\\n" +
    "    --add-opens java.base/jdk.internal.ref=ALL-UNNAMED \\\n" +
    "    --add-opens java.base/jdk.internal.reflect=ALL-UNNAMED \\\n" +
    "    --add-opens java.base/jdk.internal.math=ALL-UNNAMED \\\n" +
    "    --add-opens java.base/jdk.internal.module=ALL-UNNAMED \\\n" +
    "    --add-opens java.base/jdk.internal.util.jar=ALL-UNNAMED \\\n" +
    "    --add-opens jdk.management/com.sun.management.internal=ALL-UNNAMED \\\n" +
    "    --add-opens java.management/sun.management=ALL-UNNAMED \\\n" +
    "    -XX:+ExitOnOutOfMemoryError -XX:+CompactStrings -cp $CP -Dsimsage.external.crawler=true \\\n" +
    "    -Xms2G -Xmx2G \\\n" +
    "     nz.simsage.external.crawler.MainKt \"$@\"\n";

const bat = "REM\n" +
    "REM SimSage start script for external crawlers\n" +
    "REM\n" +
    "\n" +
    "REM change these variables to match your platform\n" +
    "set crawler_type=<ct>\n" +
    "set organisation_id=<org>\n" +
    "set kb_id=<kb>\n" +
    "set sid=<sid>\n" +
    "set source_id=<source>\n" +
    "set shared_secret_salt=<secret>\n" +
    "set api_version=1\n" +
    "set max_errors=0\n" +
    "set external_crawler_cmd_timeout_in_seconds=60\n" +
    "set exit_after_crawl=false\n" +
    "set external_crawler_use_encryption=true\n" +
    "\n" +
    "REM this is your instance / server endpoint\n" +
    "set simsage_endpoint=<server>\n" +
    "set system_temp_folder=%USERPROFILE%\\AppData\\Local\\Temp\n" +
    "\n" +
    "java ^\n" +
    "    -Djdk.attach.allowAttachSelf=true ^\n" +
    "    --add-modules java.se ^\n" +
    "    --add-exports java.base/jdk.internal.misc=ALL-UNNAMED ^\n" +
    "    --add-exports java.base/jdk.internal.ref=ALL-UNNAMED ^\n" +
    "    --add-exports java.base/sun.nio.ch=ALL-UNNAMED ^\n" +
    "    --add-exports java.management.rmi/com.sun.jmx.remote.internal.rmi=ALL-UNNAMED ^\n" +
    "    --add-exports java.rmi/sun.rmi.registry=ALL-UNNAMED ^\n" +
    "    --add-exports java.rmi/sun.rmi.server=ALL-UNNAMED ^\n" +
    "    --add-exports java.sql/java.sql=ALL-UNNAMED ^\n" +
    "    --add-opens java.base/java.io=ALL-UNNAMED ^\n" +
    "    --add-opens java.base/java.lang=ALL-UNNAMED ^\n" +
    "    --add-opens java.base/java.nio=ALL-UNNAMED ^\n" +
    "    --add-opens java.base/java.lang.module=ALL-UNNAMED ^\n" +
    "    --add-opens java.base/jdk.internal.loader=ALL-UNNAMED ^\n" +
    "    --add-opens java.base/jdk.internal.ref=ALL-UNNAMED ^\n" +
    "    --add-opens java.base/jdk.internal.reflect=ALL-UNNAMED ^\n" +
    "    --add-opens java.base/jdk.internal.math=ALL-UNNAMED ^\n" +
    "    --add-opens java.base/jdk.internal.module=ALL-UNNAMED ^\n" +
    "    --add-opens java.base/jdk.internal.util.jar=ALL-UNNAMED ^\n" +
    "    --add-opens jdk.management/com.sun.management.internal=ALL-UNNAMED ^\n" +
    "    --add-opens java.management/sun.management=ALL-UNNAMED ^\n" +
    "    -XX:+ExitOnOutOfMemoryError -XX:+CompactStrings -cp \"lib/*\" -Dsimsage.external.crawler=true ^\n" +
    "    -Xms2G -Xmx2G ^\n" +
    "     nz.simsage.external.crawler.MainKt\n";


// Crawlers.exe i aes 199b7b02-4acb-4746-8399-50a72acfe124 -source 1
const dotnet = "Crawlers.exe /debug -server <server> \\\n" +
    "     -crawler <ct> \\\n" +
    "     -source <source> \\\n" +
    "     -org <org>  \\\n" +
    "     -kb <kb> \\\n" +
    "     -sid <sid>  \\\n" +
    "     -aes <secret>\n";

export default function CrawlerExternalCrawlerConfigurationForm(props) {

    const source = props.source;

    const kb_list = useSelector((state) => state.kbReducer.kb_list);
    const selected_kb_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const shared_secret_salt = useSelector((state) => state.authReducer.shared_secret_salt);
    const [copied_id, setCopiedId] = useState('')
    const [menu, setMenu] = useState('compose')

    const handleCopyIds = (e, selected_id) => {
        e.preventDefault();
        e.stopPropagation();
        let is_copied = Api.writeToClipboard(selected_id)
        if (is_copied) setCopiedId(selected_id)
    }

    function contentToText(str) {
        let selected_kb = null;
        for (const kb of kb_list) {
            if (kb.kbId === selected_kb_id) {
                selected_kb = kb;
                break;
            }
        }
        let sid = "";
        if (selected_kb) {
            sid = selected_kb.securityId;
        }
        const source_id = parseInt("" + source.sourceId) !== 0 ? ("" + source.sourceId) : "UNKNOWN";
        return str
            .replaceAll("<source>", source_id)
            .replaceAll("<org>", "" + source.organisationId)
            .replaceAll("<kb>", "" + source.kbId)
            .replaceAll("<sid>", "" + sid)
            .replaceAll("<ct>", "" + source.crawlerType)
            .replaceAll("<version>", "" + window.ENV.version)
            .replaceAll("<secret>", "" + shared_secret_salt)
            .replaceAll("<server>", "" + window.ENV.api_base)
    }

    function selectMenu(e, menu) {
        e.preventDefault();
        e.stopPropagation();
        setMenu(menu);
        setCopiedId("");
    }

    let selected_code = contentToText(compose);
    if (menu === "docker")
        selected_code = contentToText(docker);
    if (menu === "bash")
        selected_code = contentToText(bash);
    else if (menu === "bat")
        selected_code = contentToText(bat);
    else if (menu === "dotnet")
        selected_code = contentToText(dotnet);

    return (
        <div className="tab-content px-5 py-4 overflow-auto">
            <div className="tab">
                <button className={"tablinks " + (menu === 'compose' ? "active" : "")}
                        onClick={(e) => selectMenu(e, "compose")}>
                    Docker compose
                </button>
                { source.crawlerType === "file" &&
                    <button className={"tablinks " + (menu === 'dotnet' ? "active" : "")}
                            onClick={(e) => selectMenu(e, "dotnet")}>Dotnet Crawler
                    </button>
                }
                <button className={"tablinks " + (menu === 'docker' ? "active" : "")}
                        onClick={(e) => selectMenu(e, "docker")}>Docker
                </button>
                <button className={"tablinks " + (menu === 'bash' ? "active" : "")}
                        onClick={(e) => selectMenu(e, "bash")}>bash
                </button>
                <button className={"tablinks " + (menu === 'bat' ? "active" : "")}
                        onClick={(e) => selectMenu(e, "bat")}>Windows batch
                </button>
            </div>
            <div>
                <span className="px-4 position-relative float-end">
                    <span>
                       {!copied_id &&
                           <button onClick={(e) => handleCopyIds(e, selected_code)}
                                   className={"btn text-primary btn-sm"}>Copy Code
                           </button>
                       }
                       {copied_id &&
                           <div className="text-center bg-black text-white small rounded px-2 py-1">Copied!</div>
                       }
                    </span>
                </span>
                <pre>
                    <code>{selected_code}</code>
                </pre>
            </div>
        </div>
    )
}
