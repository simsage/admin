import {Comms} from "./comms";


// api wrappers
export class Api {

    static tz_offset = Math.floor(new Date().getTimezoneOffset() / 60)
    static initial_page_size = 10;
    static initial_page = 0;
    static user_metadata_marker = "user-";

    static video_mime_type_list = ["video/mj2", "video/mpeg",
        "video/ogg", "video/x-dirac", "video/x-ogm", "video/quicktime", "video/webm", "video/x-msvideo",
        "video/mp4", "video/dv", "video/vnd-vivo", "video/vnd.radgamettools.bink",
        "video/vnd.radgamettools.smacker", "video/vnd.rn-realvideo", "video/x-flv", "video/x-mng"];

    static audio_mime_type_list = ["audio/mp4", "audio/basic", "audio/midi", "audio/mpeg", "audio/ogg",
        "audio/vorbis", "audio/opus", "audio/speex", "audio/x-aiff", "audio/x-caf", "audio/x-flac",
        "audio/x-mpegurl", "audio/x-pn-realaudio", "audio/x-pn-realaudio-plugin", "audio/x-wav",
        "audio/webm"];

    static image_mime_type_list = ["image/avif",
        "image/x-tga", "image/aces", "image/bmp", "image/x-bpg", "image/cgm", "image/x-dpx", "image/emf",
        "image/x-emf-compressed", "image/gif", "image/heif", "image/heic", "image/icns", "image/jp2",
        "image/jpeg", "image/jpm", "image/webp", "image/jpx", "image/png", "image/svg+xml", "image/tiff",
        "image/vnd.dwg", "image/vnd.dxb", "image/vnd.dxf", "image/vnd.ms-modi", "image/vnd.wap.wbmp",
        "image/vnd.zbrush.dcx", "image/vnd.zbrush.pcx", "image/avif", "image/wmf", "image/x-jbig2"];

    static office_mime_type_list = [
        "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
        "application/vnd.ms-excel", "application/vnd.ms-excel.addin.macroenabled.12", "application/vnd.ms-excel.sheet.macroenabled.12",
        "application/vnd.ms-excel.sheet.binary.macroenabled.12", "application/vnd.ms-outlook", "application/vnd.ms-outlook-pst", "application/vnd.ms-powerpoint",
        "application/vnd.ms-pub", "application/x-mspublisher", "application/vnd.ms-powerpoint.addin.macroenabled.12",
        "application/vnd.ms-powerpoint.presentation.macroenabled.12", "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
        "application/vnd.ms-word.document.macroenabled.12", "application/vnd.ms-word.template.macroenabled.12", "application/vnd.ms-xpsdocument",
        "application/vnd.oasis.opendocument.chart", "application/vnd.oasis.opendocument.chart-template", "application/vnd.oasis.opendocument.formula",
        "application/vnd.oasis.opendocument.formula-template", "application/vnd.oasis.opendocument.graphics", "application/vnd.oasis.opendocument.graphics-template",
        "application/vnd.oasis.opendocument.image", "application/vnd.oasis.opendocument.image-template", "application/vnd.oasis.opendocument.presentation",
        "application/vnd.oasis.opendocument.presentation-template", "application/vnd.oasis.opendocument.spreadsheet",
        "application/vnd.oasis.opendocument.spreadsheet-template", "application/vnd.oasis.opendocument.text", "application/vnd.oasis.opendocument.flat.text",
        "application/vnd.oasis.opendocument.flat.presentation", "application/vnd.oasis.opendocument.flat.spreadsheet", "application/vnd.oasis.opendocument.text-master",
        "application/vnd.oasis.opendocument.text-template", "application/vnd.oasis.opendocument.text-web",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.presentationml.template",
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.template", "application/vnd.ms-excel.template.macroenabled.12",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
        "application/vnd.sun.xml.writer", "application/vnd.visio", "application/vnd.ms-visio.drawing", "application/vnd.ms-visio.template",
        "application/vnd.ms-visio.stencil", "application/vnd.ms-visio.drawing.macroEnabled.12", "application/vnd.ms-visio.template.macroEnabled.12",
        "application/vnd.ms-visio.stencil.macroEnabled.12", "application/vnd.google-apps.document", "application/vnd.google-apps.spreadsheet",
        "application/vnd.google-apps.presentation", "application/vnd.google-apps.form", "application/vnd.google-apps.drawing", "application/vnd.google-apps.site",
        "application/vnd.ms-powerpoint.slide.macroEnabled.12", "application/vnd.ms-powerpoint.template.macroEnabled.12", "application/vnd.ms-project"
    ]

    static file_type_to_mime_type = {
        "bat": ["application/x-bat"],
        "cmd": ["application/x-bat"],
        "bpm": ["application/bizagi-modeler"],
        "cbor": ["application/cbor"],
        "cdr": ["application/coreldraw"],
        "ditamap": ["application/dita+xml;format=map"],
        "dita": ["application/dita+xml;format=topic"],
        "ditaval": ["application/dita+xml;format=val"],
        "epub": ["application/epub+zip"],
        "fits": ["application/fits"],
        "fit": ["application/fits"],
        "fts": ["application/fits"],
        "ai": ["application/illustrator"],
        "idml": ["application/vnd.adobe.indesign-idml-package"],
        "jar": ["application/java-archive"],
        "js": ["application/javascript", "text/javascript"],
        "kt": ["text/x-kotlin"],
        "class": ["application/java-vm"],
        "jnilib": ["application/x-java-jnilib"],
        "hprof": ["application/vnd.java.hprof "],
        "ma": ["application/mathematica"],
        "nb": ["application/mathematica"],
        "mb": ["application/mathematica"],
        "wl": ["application/vnd.wolfram.wl"],
        "mp4": ["application/mp4", "video/mp4"],
        "m4v": ["application/mp4", "video/mp4"],
        "hevc": ["application/mp4", "video/mp4"],
        "m4a": ["audio/mp4"],
        "mpa": ["audio/mp4"],
        "doc": ["application/msword"],
        "dot": ["application/msword"],
        "onetoc": ["application/onenote;format=onetoc2"],
        "onetoc2": ["application/onenote;format=onetoc2"],
        "onepkg": ["application/onenote; format=package"],
        "pdf": ["application/pdf"],
        "ps": ["application/postscript"],
        "eps": ["application/postscript"],
        "epsf": ["application/postscript"],
        "epsi": ["application/postscript"],
        "rdf": ["application/rdf+xml"],
        "owl": ["application/rdf+xml"],
        "df$": ["application/rdf+xml"],
        "wl$": ["application/rdf+xml"],
        "xmp": ["application/rdf+xml"],
        "rtf": ["application/rtf"],
        "srl": ["application/sereal"],
        "smi": ["application/smil+xml"],
        "smil": ["application/smil+xml"],
        "sml": ["application/smil+xml"],
        "sldprt": ["application/sldworks"],
        "sldasm": ["application/sldworks"],
        "slddrw": ["application/sldworks"],
        "asice": ["application/vnd.etsi.asic-e+zip"],
        "asics": ["application/vnd.etsi.asic-s+zip"],
        "fdf": ["application/vnd.fdf"],
        "kml": ["application/vnd.google-earth.kml+xml"],
        "nar": ["application/vnd.iptc.g2.newsmessage+xml"],
        "chrt": ["application/vnd.kde.kchart"],
        "kpr": ["application/vnd.kde.kpresenter"],
        "kpt": ["application/vnd.kde.kpresenter"],
        "ksp": ["application/vnd.kde.kspread"],
        "kwd": ["application/vnd.kde.kword"],
        "kwt": ["application/vnd.kde.kword"],
        "skp": ["application/vnd.koan"],
        "skd": ["application/vnd.koan"],
        "skt": ["application/vnd.koan"],
        "skm": ["application/vnd.koan"],
        "mif": ["application/vnd.mif"],
        "mmp": ["application/vnd.mindjet.mindmanager"],
        "mmap": ["application/vnd.mindjet.mindmanager"],
        "mmpt": ["application/vnd.mindjet.mindmanager"],
        "mmat": ["application/vnd.mindjet.mindmanager"],
        "mmmp": ["application/vnd.mindjet.mindmanager"],
        "mmas": ["application/vnd.mindjet.mindmanager"],
        "xls": ["application/vnd.ms-excel"],
        "xlm": ["application/vnd.ms-excel"],
        "xla": ["application/vnd.ms-excel"],
        "xlc": ["application/vnd.ms-excel"],
        "xlt": ["application/vnd.ms-excel"],
        "xlw": ["application/vnd.ms-excel"],
        "xll": ["application/vnd.ms-excel"],
        "xld": ["application/vnd.ms-excel"],
        "xlam": ["application/vnd.ms-excel.addin.macroenabled.12"],
        "xlsm": ["application/vnd.ms-excel.sheet.macroenabled.12"],
        "xlsb": ["application/vnd.ms-excel.sheet.binary.macroenabled.12"],
        "msg": ["application/vnd.ms-outlook"],
        "oft": ["application/vnd.ms-outlook"],
        "pst": ["application/vnd.ms-outlook-pst"],
        "ost": ["application/vnd.ms-outlook-pst"],
        "ppt": ["application/vnd.ms-powerpoint"],
        "ppz": ["application/vnd.ms-powerpoint"],
        "pps": ["application/vnd.ms-powerpoint"],
        "pot": ["application/vnd.ms-powerpoint"],
        "ppa": ["application/vnd.ms-powerpoint"],
        "pub": ["application/vnd.ms-pub", "application/x-mspublisher"],
        "ppam": ["application/vnd.ms-powerpoint.addin.macroenabled.12"],
        "pptm": ["application/vnd.ms-powerpoint.presentation.macroenabled.12"],
        "ppsm": ["application/vnd.ms-powerpoint.slideshow.macroenabled.12"],
        "docm": ["application/vnd.ms-word.document.macroenabled.12"],
        "dotm": ["application/vnd.ms-word.template.macroenabled.12"],
        "xps": ["application/vnd.ms-xpsdocument"],
        "oxps": ["application/vnd.ms-xpsdocument"],
        "odc": ["application/vnd.oasis.opendocument.chart"],
        "otc": ["application/vnd.oasis.opendocument.chart-template"],
        "odf": ["application/vnd.oasis.opendocument.formula"],
        "odft": ["application/vnd.oasis.opendocument.formula-template"],
        "odg": ["application/vnd.oasis.opendocument.graphics"],
        "otg": ["application/vnd.oasis.opendocument.graphics-template"],
        "odi": ["application/vnd.oasis.opendocument.image"],
        "oti": ["application/vnd.oasis.opendocument.image-template"],
        "odp": ["application/vnd.oasis.opendocument.presentation"],
        "otp": ["application/vnd.oasis.opendocument.presentation-template"],
        "ods": ["application/vnd.oasis.opendocument.spreadsheet"],
        "ots": ["application/vnd.oasis.opendocument.spreadsheet-template"],
        "odt": ["application/vnd.oasis.opendocument.text"],
        "fodt": ["application/vnd.oasis.opendocument.flat.text"],
        "fodp": ["application/vnd.oasis.opendocument.flat.presentation"],
        "fods": ["application/vnd.oasis.opendocument.flat.spreadsheet"],
        "otm": ["application/vnd.oasis.opendocument.text-master"],
        "ott": ["application/vnd.oasis.opendocument.text-template"],
        "oth": ["application/vnd.oasis.opendocument.text-web"],
        "pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
        "thmx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
        "potx": ["application/vnd.openxmlformats-officedocument.presentationml.template"],
        "ppsx": ["application/vnd.openxmlformats-officedocument.presentationml.slideshow"],
        "xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
        "xltx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.template"],
        "xltm": ["application/vnd.ms-excel.template.macroenabled.12"],
        "docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        "dotx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.template"],
        "sxw": ["application/vnd.sun.xml.writer"],
        "pcap": ["application/vnd.tcpdump.pcap"],
        "cap": ["application/vnd.tcpdump.pcap"],
        "dmp": ["application/vnd.tcpdump.pcap"],
        "vsd": ["application/vnd.visio"],
        "vst": ["application/vnd.visio"],
        "vss": ["application/vnd.visio"],
        "vsw": ["application/vnd.visio"],
        "vsdx": ["application/vnd.ms-visio.drawing"],
        "vstx": ["application/vnd.ms-visio.template"],
        "vssx": ["application/vnd.ms-visio.stencil"],
        "vsdm": ["application/vnd.ms-visio.drawing.macroEnabled.12"],
        "vstm": ["application/vnd.ms-visio.template.macroEnabled.12"],
        "vssm": ["application/vnd.ms-visio.stencil.macroEnabled.12"],
        "wmlc": ["application/vnd.wap.wmlc"],
        "wmlsc": ["application/vnd.wap.wmlscriptc"],
        "wpd": ["application/vnd.wordperfect"],
        "wp": ["application/vnd.wordperfect"],
        "wp5": ["application/vnd.wordperfect"],
        "wp6": ["application/vnd.wordperfect"],
        "w60": ["application/vnd.wordperfect"],
        "wp61": ["application/vnd.wordperfect"],
        "wpt": ["application/vnd.wordperfect"],
        "warc": ["application/warc"],
        "wasm": ["application/wasm"],
        "tga": ["image/x-tga"],
        "icb": ["image/x-tga"],
        "vda": ["image/x-tga"],
        "axx": ["application/x-axcrypt"],
        "indd": ["application/x-adobe-indesign"],
        "inx": ["application/x-adobe-indesign-interchange"],
        "gtar": ["application/x-gtar"],
        "bz2": ["application/x-bzip2"],
        "tbz2": ["application/x-bzip2"],
        "boz": ["application/x-bzip2"],
        "vcd": ["application/x-cdlink"],
        "crx": ["application/x-chrome-package"],
        "cpio": ["application/x-cpio"],
        "dex": ["application/x-dex"],
        "dir": ["application/x-director"],
        "dcr": ["application/x-director"],
        "dxr": ["application/x-director"],
        "cst": ["application/x-director"],
        "cct": ["application/x-director"],
        "cxt": ["application/x-director"],
        "w3d": ["application/x-director"],
        "fgd": ["application/x-director"],
        "swa": ["application/x-director"],
        "dvi": ["application/x-dvi"],
        "elc": ["application/x-elc"],
        "kil": ["application/x-killustrator"],
        "exe": ["application/x-dosexec"],
        "fp7": ["application/x-filemaker"],
        "otf": ["application/x-font-otf"],
        "ttf": ["application/x-font-ttf"],
        "ttc": ["application/x-font-ttf"],
        "afm": ["application/x-font-adobe-metric"],
        "acfm": ["application/x-font-adobe-metric"],
        "amfm": ["application/x-font-adobe-metric"],
        "pfm": ["application/x-font-printer-metric"],
        "spl": ["application/x-futuresplash"],
        "grb": ["application/x-grib"],
        "grb1": ["application/x-grib"],
        "grb2": ["application/x-grib"],
        "gz": ["application/gzip"],
        "tgz": ["application/gzip"],
        "zstd": ["application/zstd"],
        "hdf": ["application/x-hdf"],
        "he5": ["application/x-hdf"],
        "h5": ["application/x-hdf"],
        "ibooks": ["application/x-ibooks+zip"],
        "arc": ["application/x-internet-archive"],
        "iso": ["application/x-iso9660-image"],
        "ipa": ["application/x-itunes-ipa"],
        "latex": ["application/x-latex"],
        "lz4": ["application/x-lz4"],
        "lz": ["application/x-lzip"],
        "lzma": ["application/x-lzma"],
        "memgraph": ["application/x-memgraph"],
        "prc": ["application/x-mobipocket-ebook"],
        "mobi": ["application/x-mobipocket-ebook"],
        "msi": ["application/x-ms-installer"],
        "msp": ["application/x-ms-installer"],
        "mst": ["application/x-ms-installer"],
        "MYI": ["application/x-mysql-misam-compressed-index"],
        "MYD": ["application/x-mysql-misam-data"],
        "qpw": ["application/x-quattro-pro"],
        "wb1": ["application/x-quattro-pro"],
        "wb2": ["application/x-quattro-pro"],
        "wb3": ["application/x-quattro-pro"],
        "xq": ["application/xquery"],
        "xquery": ["application/xquery"],
        "rar": ["application/x-rar-compressed"],
        "rpm": ["application/x-rpm"],
        "sas": ["application/x-sas"],
        "ss7": ["application/x-sas-program-data"],
        "sas7bpgm": ["application/x-sas-program-data"],
        "st7": ["application/x-sas-audit"],
        "sas7baud": ["application/x-sas-audit"],
        "sd2": ["application/x-sas-data-v6"],
        "sd7": ["application/x-sas-data"],
        "sas7bdat": ["application/x-sas-data"],
        "sv7": ["application/x-sas-view"],
        "sas7bvew": ["application/x-sas-view"],
        "si7": ["application/x-sas-data-index"],
        "sas7bndx": ["application/x-sas-data-index"],
        "sc7": ["application/x-sas-catalog"],
        "sas7bcat": ["application/x-sas-catalog"],
        "sa7": ["application/x-sas-access"],
        "sas7bacs": ["application/x-sas-access"],
        "sf7": ["application/x-sas-fdb"],
        "sas7bfdb": ["application/x-sas-fdb"],
        "sm7": ["application/x-sas-mddb"],
        "sas7bmdb": ["application/x-sas-mddb"],
        "s7m": ["application/x-sas-dmdb"],
        "sas7bdmd": ["application/x-sas-dmdb"],
        "sr7": ["application/x-sas-itemstor"],
        "sas7bitm": ["application/x-sas-itemstor"],
        "su7": ["application/x-sas-utility"],
        "sas7butl": ["application/x-sas-utility"],
        "sp7": ["application/x-sas-putility"],
        "sas7bput": ["application/x-sas-putility"],
        "stx": ["application/x-sas-transport"],
        "sas7bbak": ["application/x-sas-backup"],
        "xpt": ["application/x-sas-xport"],
        "xport": ["application/x-sas-xport"],
        "sh": ["application/x-sh"],
        "bash": ["application/x-sh"],
        "shp": ["application/x-shapefile"],
        "swf": ["application/x-shockwave-flash"],
        "sz": ["application/x-snappy-framed"],
        "sfdu": ["application/x-sfdu"],
        "do": ["application/x-stata-do"],
        "dta": ["application/x-stata-dta"],
        "tex": ["application/x-tex"],
        "vmdk": ["application/x-vmdk"],
        "xmind": ["application/x-xmind"],
        "xml": ["application/xml", "text/xml"],
        "xsl": ["application/xml", "text/xml"],
        "xsd": ["application/xml", "text/xml"],
        "mm": ["application/xml", "text/xml"],
        "dicon": ["application/xml", "text/xml"],
        "dtd": ["application/xml-dtd"],
        "xslfo": ["application/xslfo+xml"],
        "fo": ["application/xslfo+xml"],
        "xslt": ["application/xslt+xml"],
        "xspf": ["application/xspf+xml"],
        "zip": ["application/zip"],
        "7z": ["application/x-7z-compressed"],
        "gdoc": ["application/vnd.google-apps.document"],
        "gxls": ["application/vnd.google-apps.spreadsheet"],
        "gppt": ["application/vnd.google-apps.presentation"],
        "gform": ["application/vnd.google-apps.form"],
        "gdraw": ["application/vnd.google-apps.drawing"],
        "ghtml": ["application/vnd.google-apps.site"],
        "au": ["audio/basic"],
        "snd": ["audio/basic"],
        "mid": ["audio/midi"],
        "midi": ["audio/midi"],
        "kar": ["audio/midi"],
        "rmi": ["audio/midi"],
        "mp3": ["audio/mpeg"],
        "mpga": ["audio/mpeg"],
        "mp2": ["audio/mpeg"],
        "mp2a": ["audio/mpeg"],
        "m2a": ["audio/mpeg"],
        "m3a": ["audio/mpeg"],
        "oga": ["audio/ogg"],
        "ogg": ["audio/vorbis"],
        "opus": ["audio/opus"],
        "spx": ["audio/speex"],
        "aif": ["audio/x-aiff"],
        "aiff": ["audio/x-aiff"],
        "aifc": ["audio/x-aiff"],
        "caf": ["audio/x-caf"],
        "flac": ["audio/x-flac"],
        "m3u": ["audio/x-mpegurl"],
        "ram": ["audio/x-pn-realaudio"],
        "ra": ["audio/x-pn-realaudio"],
        "rmp": ["audio/x-pn-realaudio-plugin"],
        "wav": ["audio/x-wav"],
        "weba": ["audio/webm"],
        "pdb": ["chemical/x-pdb"],
        "exr": ["image/aces"],
        "bmp": ["image/bmp"],
        "dib": ["image/bmp"],
        "bpg": ["image/x-bpg"],
        "cgm": ["image/cgm"],
        "dpx": ["image/x-dpx"],
        "emf": ["image/emf"],
        "emz": ["image/x-emf-compressed"],
        "gif": ["image/gif"],
        "heif": ["image/heif"],
        "heic": ["image/heic"],
        "icns": ["image/icns"],
        "jp2": ["image/jp2"],
        "jpg": ["image/jpeg"],
        "jpeg": ["image/jpeg"],
        "jpe": ["image/jpeg"],
        "jif": ["image/jpeg"],
        "jfif": ["image/jpeg"],
        "jfi": ["image/jpeg"],
        "jpm": ["image/jpm"],
        "jpgm": ["image/jpm"],
        "webp": ["image/webp"],
        "jpf": ["image/jpx"],
        "png": ["image/png"],
        "svg": ["image/svg+xml"],
        "svgz": ["image/svg+xml"],
        "tiff": ["image/tiff"],
        "tif": ["image/tiff"],
        "psd": ["image/vnd.adobe.photoshop"],
        "dwg": ["image/vnd.dwg"],
        "dxb": ["image/vnd.dxb"],
        "dxf": ["image/vnd.dxf"],
        "mdi": ["image/vnd.ms-modi"],
        "wbmp": ["image/vnd.wap.wbmp"],
        "dcx": ["image/vnd.zbrush.dcx"],
        "pcx": ["image/vnd.zbrush.pcx"],
        "avif": ["image/avif"],
        "wmf": ["image/wmf"],
        "fh": ["image/x-freehand"],
        "fhc": ["image/x-freehand"],
        "fh4": ["image/x-freehand"],
        "fh40": ["image/x-freehand"],
        "fh5": ["image/x-freehand"],
        "fh50": ["image/x-freehand"],
        "fh7": ["image/x-freehand"],
        "fh8": ["image/x-freehand"],
        "fh9": ["image/x-freehand"],
        "fh10": ["image/x-freehand"],
        "fh11": ["image/x-freehand"],
        "fh12": ["image/x-freehand"],
        "ft7": ["image/x-freehand"],
        "ft8": ["image/x-freehand"],
        "ft9": ["image/x-freehand"],
        "ft10": ["image/x-freehand"],
        "ft11": ["image/x-freehand"],
        "ft12": ["image/x-freehand"],
        "jb2": ["image/x-jbig2"],
        "jbig2": ["image/x-jbig2"],
        "j2c": ["image/x-jp2-codestream"],
        "pic": ["image/x-pict"],
        "pct": ["image/x-pict"],
        "pict": ["image/x-pict"],
        "pnm": ["image/x-portable-anymap"],
        "pbm": ["image/x-portable-bitmap"],
        "pgm": ["image/x-portable-graymap"],
        "ppm": ["image/x-portable-pixmap"],
        "dng": ["image/x-raw-adobe"],
        "3fr": ["image/x-raw-hasselblad"],
        "raf": ["image/x-raw-fuji"],
        "crw": ["image/x-raw-canon"],
        "cr2": ["image/x-raw-canon"],
        "k25": ["image/x-raw-kodak"],
        "kdc": ["image/x-raw-kodak"],
        "dcs": ["image/x-raw-kodak"],
        "drf": ["image/x-raw-kodak"],
        "mrw": ["image/x-raw-minolta"],
        "nef": ["image/x-raw-nikon"],
        "nrw": ["image/x-raw-nikon"],
        "orf": ["image/x-raw-olympus"],
        "ptx": ["image/x-raw-pentax"],
        "pef": ["image/x-raw-pentax"],
        "arw": ["image/x-raw-sony"],
        "srf": ["image/x-raw-sony"],
        "sr2": ["image/x-raw-sony"],
        "x3f": ["image/x-raw-sigma"],
        "erf": ["image/x-raw-epson"],
        "mef": ["image/x-raw-mamiya"],
        "mos": ["image/x-raw-leaf"],
        "raw": ["image/x-raw-panasonic"],
        "rw2": ["image/x-raw-panasonic"],
        "iiq": ["image/x-raw-phaseone"],
        "r3d": ["image/x-raw-red"],
        "fff": ["image/x-raw-imacon"],
        "pxn": ["image/x-raw-logitech"],
        "bay": ["image/x-raw-casio"],
        "rwz": ["image/x-raw-rawzor"],
        "rgb": ["image/x-rgb"],
        "xcf": ["image/x-xcf"],
        "xwd": ["image/x-xwindowdump"],
        "mht": ["multipart/related"],
        "mhtml": ["multipart/related"],
        "igs": ["model/iges"],
        "iges": ["model/iges"],
        "dwf": ["model/vnd.dwf"],
        "dwfx": ["model/vnd.dwfx+xps"],
        "eml": ["message/rfc822"],
        "as": ["text/x-actionscript"],
        "ada": ["text/x-ada"],
        "adb": ["text/x-ada"],
        "ads": ["text/x-ada"],
        "applescript": ["text/x-applescript"],
        "asp": ["text/asp"],
        "aspx": ["text/aspdotnet"],
        "aj": ["text/x-aspectj"],
        "s": ["text/x-assembly"],
        "asm": ["text/x-assembly"],
        "css": ["text/css"],
        "html": ["text/html"],
        "htm": ["text/html"],
        "t": ["text/troff"],
        "tr": ["text/troff"],
        "roff": ["text/troff"],
        "man": ["text/troff"],
        "me": ["text/troff"],
        "ms": ["text/troff"],
        "gv": ["text/vnd.graphviz"],
        "anpa": ["text/vnd.iptc.anpa"],
        "wmls": ["text/vnd.wap.wmlscript"],
        "vtt": ["text/vtt"],
        "awk": ["text/x-awk"],
        "bas": ["text/x-basic"],
        "c": ["text/x-csrc", "text/x-csrc"],
        "h": ["text/x-chdr", "text/x-chdr"],
        "hpp": ["text/x-c++hdr"],
        "hxx": ["text/x-c++hdr"],
        "hh": ["text/x-c++hdr"],
        "h++": ["text/x-c++hdr"],
        "hp": ["text/x-c++hdr"],
        "cpp": ["text/x-c++src"],
        "cxx": ["text/x-c++src"],
        "cc": ["text/x-c++src"],
        "c++": ["text/x-c++src"],
        "rs": ["text/x-rust"],
        "cgi": ["text/x-cgi"],
        "clj": ["text/x-clojure"],
        "coffee": ["text/x-coffeescript"],
        "cs": ["text/x-csharp"],
        "cbl": ["text/x-cobol"],
        "cob": ["text/x-cobol"],
        "cfm": ["text/x-coldfusion"],
        "cfml": ["text/x-coldfusion"],
        "cfc": ["text/x-coldfusion"],
        "cl": ["text/x-common-lisp"],
        "jl": ["text/x-common-lisp"],
        "lisp": ["text/x-common-lisp"],
        "lsp": ["text/x-common-lisp"],
        "e": ["text/x-eiffel"],
        "el": ["text/x-emacs-lisp"],
        "erl": ["text/x-erlang"],
        "exp": ["text/x-expect"],
        "4th": ["text/x-forth"],
        "f": ["text/x-fortran"],
        "for": ["text/x-fortran"],
        "f77": ["text/x-fortran"],
        "f90": ["text/x-fortran"],
        "go": ["text/x-go"],
        "groovy": ["text/x-groovy"],
        "hs": ["text/x-haskell"],
        "lhs": ["text/x-haskell"],
        "idl": ["text/x-idl"],
        "ini": ["text/x-ini"],
        "java": ["text/x-java-source", "text/x-java"],
        "properties": ["text/x-java-properties"],
        "jsp": ["text/x-jsp"],
        "less": ["text/x-less"],
        "l": ["text/x-lex"],
        "log": ["text/x-log"],
        "lua": ["text/x-lua"],
        "ml": ["text/x-ml"],
        "m3": ["text/x-modula"],
        "i3": ["text/x-modula"],
        "mg": ["text/x-modula"],
        "ig": ["text/x-modula"],
        "m": ["text/x-objcsrc"],
        "ocaml": ["text/x-ocaml"],
        "mli": ["text/x-ocaml"],
        "p": ["text/x-pascal"],
        "pp": ["text/x-pascal"],
        "pas": ["text/x-pascal"],
        "dpr": ["text/x-pascal"],
        "pl": ["text/x-perl"],
        "pm": ["text/x-perl"],
        "al": ["text/x-perl"],
        "perl": ["text/x-perl"],
        "php": ["text/x-php"],
        "php3": ["text/x-php"],
        "php4": ["text/x-php"],
        "pro": ["text/x-prolog"],
        "py": ["text/x-python"],
        "rest": ["text/x-rst"],
        "rst": ["text/x-rst"],
        "restx": ["text/x-rst"],
        "rexx": ["text/x-rexx"],
        "rb": ["text/x-ruby"],
        "scala": ["text/x-scala"],
        "scm": ["text/x-scheme"],
        "sed": ["text/x-sed"],
        "sql": ["text/x-sql"],
        "st": ["text/x-stsrc"],
        "itk": ["text/x-tcl"],
        "tcl": ["text/x-tcl"],
        "tk": ["text/x-tcl"],
        "cls": ["text/x-vbasic"],
        "frm": ["text/x-vbasic"],
        "vb": ["text/x-vbdotnet"],
        "vbs": ["text/x-vbscript"],
        "v": ["text/x-verilog"],
        "vhd": ["text/x-vhdl"],
        "vhdl": ["text/x-vhdl"],
        "md": ["text/x-web-markdown"],
        "mdtext": ["text/x-web-markdown"],
        "mkd": ["text/x-web-markdown"],
        "markdown": ["text/x-web-markdown"],
        "y": ["text/x-yacc"],
        "yaml": ["text/x-yaml"],
        "mj2": ["video/mj2"],
        "mjp2": ["video/mj2"],
        "mpeg": ["video/mpeg"],
        "mpg": ["video/mpeg"],
        "mpe": ["video/mpeg"],
        "m1v": ["video/mpeg"],
        "m2v": ["video/mpeg"],
        "ogv": ["video/ogg"],
        "drc": ["video/x-dirac"],
        "ogm": ["video/x-ogm"],
        "qt": ["video/quicktime"],
        "mov": ["video/quicktime"],
        "webm": ["video/webm"],
        "asx": ["application/x-ms-asx"],
        "avi": ["video/x-msvideo"],
        "ice": ["x-conference/x-cooltalk"],
        "fb2": ["application/x-fictionbook+xml"],
        "asciidoc": ["text/x-asciidoc"],
        "adoc": ["text/x-asciidoc"],
        "ad": ["text/x-asciidoc"],
        "d": ["text/x-d"],
        "haml": ["text/x-haml"],
        "hx": ["text/x-haxe"],
        "xlf": ["application/x-xliff+xml"],
        "xliff": ["application/x-xliff+xml"],
        "xlz": ["application/x-xliff+zip"],
        "r": ["text/x-rsrc"],
        "txt": ["text/plain"],
        "boxnote": ["text/plain"],
        "csv": ["text/csv"],
        "dx": ["application/dec-dx."],
        "dcm": ["application/dicom"],
        "geojson": ["application/geo+json"],
        "gpkg": ["application/geopackage+sqlite3"],
        "gml": ["application/gml+xml"],
        "inf": ["application/inf"],
        "json": ["application/json"],
        "gltf": ["application/json"],
        "har": ["application/json"],
        "lwp": ["textapplication/lwp"],
        "mbox": ["application/mbox"],
        "one": ["application/msonenote"],
        "mxf": ["application/mxf"],
        "bin": ["application/octet-stream", "application/octet-stream", "application/macbinary", "application/mac-binary", "application/x-binary", "application/x-macbinary"],
        "dwl": ["application/octet-stream"],
        "p7b": ["application/pkcs7-signature"],
        "p7m": ["application/pkcs7-signature"],
        "p7s": ["application/pkcs7-signature"],
        "qif": ["application/qif"],
        "acsm": ["application/vnd.adobe.adept+xml"],
        "air": ["application/vnd.adobe.air-application-installer-package+zip"],
        "xfdf": ["application/vnd.adobe.xfdf"],
        "bdoc": ["application/vnd.bdoc-1.0"],
        "tst": ["application/vnd.etsi.timestamp-token"],
        "fm": ["application/vnd.framemaker"],
        "geo": ["application/vnd.geogebra.file"],
        "ggb": ["application/vnd.geogebra.file"],
        "gbr": ["application/vnd.gerber"],
        "kmz": ["application/vnd.google-earth.kmz"],
        "000": ["application/vnd.hp-HPGL"],
        "hpgl": ["application/vnd.hp-HPGL"],
        "fcs": ["application/vnd.isac.fcs"],
        "123": ["application/vnd.lotus-1-2-3"],
        "wk1": ["application/vnd.lotus-1-2-3"],
        "wk2": ["application/vnd.lotus-1-2-3"],
        "wk3": ["application/vnd.lotus-1-2-3"],
        "wk4": ["application/vnd.lotus-1-2-3"],
        "wks": ["application/vnd.lotus-1-2-3"],
        "apt": ["application/vnd.lotus-approach"],
        "mas": ["application/vnd.lotus-freelance"],
        "prz": ["application/vnd.lotus-freelance"],
        "ns2": ["application/vnd.lotus-notes"],
        "nsf": ["application/vnd.lotus-notes"],
        "sam": ["application/vnd.lotus-wordpro"],
        "3mf": ["application/vnd.ms-3mfdocument"],
        "cab": ["application/vnd.ms-cab-compressed"],
        "eot": ["application/vnd.ms-fontobject"],
        "chm": ["application/vnd.ms-htmlhelp"],
        "chw": ["application/vnd.ms-htmlhelp"],
        "sldm": ["application/vnd.ms-powerpoint.slide.macroEnabled.12"],
        "potm": ["application/vnd.ms-powerpoint.template.macroEnabled.12"],
        "mpp": ["application/vnd.ms-project"],
        "msa": ["application/vnd.msa-disk-image"],
        "nif": ["application/vnd.music-niff"],
        "ntf": ["application/vnd.nitf"],
        "p65": ["application/vnd.pagemaker"],
        "pmd": ["application/vnd.pagemaker"],
        "pmt": ["application/vnd.pagemaker"],
        "t65": ["application/vnd.pagemaker"],
        "pm4": ["application/vnd.pagemaker"],
        "pt4": ["application/vnd.pagemaker"],
        "pm5": ["application/vnd.pagemaker"],
        "pt5": ["application/vnd.pagemaker"],
        "pm6": ["application/vnd.pagemaker"],
        "pt6": ["application/vnd.pagemaker"],
        "qcd": ["application/vnd.Quark.QuarkXPress"],
        "qpt": ["application/vnd.Quark.QuarkXPress"],
        "qwd": ["application/vnd.Quark.QuarkXPress"],
        "qwt": ["application/vnd.Quark.QuarkXPress"],
        "qxb": ["application/vnd.Quark.QuarkXPress"],
        "qxd": ["application/vnd.Quark.QuarkXPress"],
        "qxl": ["application/vnd.Quark.QuarkXPress"],
        "qxp": ["application/vnd.Quark.QuarkXPress"],
        "qxt": ["application/vnd.Quark.QuarkXPress"],
        "qxp report": ["application/vnd.Quark.QuarkXPress"],
        "qxp%20report": ["application/vnd.Quark.QuarkXPress"],
        "xtg": ["application/vnd.Quark.QuarkXPress"],
        "mxl": ["application/vnd.recordare.musicxml"],
        "rm": ["application/vnd.rn-realmedia"],
        "rmvb": ["application/vnd.rn-realmedia"],
        "zfo": ["application/vnd.software602.filler.form-xml-zip"],
        "sda": ["application/vnd.stardivision.draw"],
        "sxc": ["application/vnd.sun.xml.calc"],
        "sxd": ["application/vnd.sun.xml.draw"],
        "sxi": ["application/vnd.sun.xml.impress"],
        "vwx": ["application/vnd.vectorworks"],
        "mmf": ["application/vnd.yamaha.smaf-audio"],
        "cda": ["application/x-cdf"],
        "enz": ["application/x-endnote-connect"],
        "enr": ["application/x-endnote-refer"],
        "enw": ["application/x-endnote-refer"],
        "ens": ["application/x-endnote-style"],
        "gnumeric": ["application/x-gnumeric"],
        "$td": ["application/x-js-taro"],
        "jtd": ["application/x-js-taro"],
        "jtt": ["application/x-js-taro"],
        "kra": ["application/x-krita"],
        "cdf": ["application/x-netcdf"],
        "nc": ["application/x-netcdf"],
        "ofx": ["application/x-ofx"],
        "qfx": ["application/x-ofx"],
        "mpx": ["application/x-project"],
        "shar": ["application/x-shar"],
        "sit": ["application/x-stuffit"],
        "tar": ["application/x-tar"],
        "wacz": ["application/x-wacz"],
        "ent": ["application/xml-external-parsed-entity"],
        "3gp": ["audio/3gpp"],
        "3gpp": ["audio/3gpp"],
        "ac3": ["audio/ac3"],
        "amr": ["audio/amr"],
        "awb": ["audio/amr-wb"],
        "dls": ["audio/dls"],
        "qcp": ["audio/qcelp"],
        "tta": ["audio/tta"],
        "aac": ["audio/vnd.dlna.adts"],
        "adts": ["audio/vnd.dlna.adts"],
        "mlp": ["audio/vnd.dolby.mlp"],
        "dts": ["audio/vnd.dts"],
        "xm": ["audio/xm"],
        "woff": ["font/woff"],
        "woff2": ["font/woff2"],
        "flif": ["image/flif"],
        "jxl": ["image/jxl"],
        "jxr": ["image/jxr"],
        "wdp": ["image/jxr"],
        "ktx": ["image/ktx"],
        "ora": ["image/openraster"],
        "svf": ["image/vnd-svf"],
        "fpx": ["image/vnd.fpx"],
        "mix": ["image/vnd.mix"],
        "vtf": ["image/vnd.valve.source.texture"],
        "xif": ["image/vnd.xiff"],
        "djv": ["image/x-djvu"],
        "djvu": ["image/x-djvu"],
        "ico": ["image/x-icon"],
        "jng": ["image/x-jng"],
        "sld": ["image/x-sld"],
        "ras": ["image/x-sun-raster"],
        "sun": ["image/x-sun-raster"],
        "cur": ["image/x-win-bitmap"],
        "xbm": ["image/x-xbitmap"],
        "xpm": ["image/x-xpixmap"],
        "e57": ["model/e57"],
        "glb": ["model/gltf-binary"],
        "dae": ["model/vnd.collada+xml"],
        "wrl": ["model/vrml"],
        "ics": ["text/calendar"],
        "gradle": ["text/x-gradle"],
        "csvs": ["text/csv-schema"],
        "n3": ["text/n3"],
        "textgrid": ["text/praat-textgrid"],
        "sgm": ["text/sgml"],
        "sgml": ["text/sgml"],
        "tsv": ["text/tab-separated-values"],
        "ttl": ["text/turtle"],
        "vcf": ["text/vcard"],
        "sos": ["text/vnd.sosi"],
        "wml": ["text/vnd.wap.wml"],
        "cha": ["text/x-chat"],
        "vcs": ["text/x-vCalendar"],
        "dv": ["video/dv"],
        "viv": ["video/vnd-vivo"],
        "bik2": ["video/vnd.radgamettools.bink"],
        "bk2": ["video/vnd.radgamettools.bink"],
        "smk": ["video/vnd.radgamettools.smacker"],
        "rv": ["video/vnd.rn-realvideo"],
        "flv": ["video/x-flv"],
        "mng": ["video/x-mng"],
        "001": ["application/octet-stream"],
        "3dd": ["application/vnd.esri.3dd"],
        "3dm": ["x-world/x-3dmf", "model/vnd.rhinoceros"],
        "3dmf": ["model/3mf"],
        "3ds": ["image/x-3ds", "application/x-3ds"],
        "4bt": ["application/octet-stream"],
        "4xa": ["application/octet-stream"],
        "4xm": ["application/octet-stream"],
        "602": ["text/plain", "text/t602", "application/x-t602"],
        "a": ["application/x-archive"],
        "aae": ["text/xml"],
        "abd": ["application/x-quicken-data"],
        "qdf": ["application/x-quicken-data"],
        "qel": ["application/x-quicken-data"],
        "abif": ["application/octet-stream"],
        "abt": ["application/octet-stream"],
        "abw": ["application/x-abiword"],
        "ac$": ["application/octet-stream"],
        "acb": ["application/vnd.adobe.color-book", "application/octet-stream"],
        "accdb": ["application/msaccess"],
        "acd": ["application/octet-stream"],
        "aco": ["application/octet-stream"],
        "acv": ["application/octet-stream"],
        "atf": ["application/octet-stream"],
        "ad1": ["application/octet-stream"],
        "ad2": ["application/octet-stream"],
        "ad3": ["application/octet-stream"],
        "ad4": ["application/octet-stream"],
        "ad5": ["application/octet-stream"],
        "adc": ["image/bitmap"],
        "adf": ["application/vnd.esri.arcinfo.grid"],
        "adi": ["application/acad"],
        "adx": ["audio/x-adx", "audio/adx"],
        "aep": ["application/vnd.adobe.aftereffects.project"],
        "aero": ["application/octet-stream"],
        "afc": ["audio/x-afc"],
        "aff": ["application/x-aff"],
        "afp": ["application/vnd.afp"],
        "ags": ["application/vnd.ags AGS4"],
        "ahx": ["audio/x-ahx", "audio/ahx", "application/octet-stream"],
        "aih": ["application/octet-stream"],
        "ain": ["application/octet-stream"],
        "aix": ["audio/x-aix", "audio/aix", "application/octet-stream"],
        "albm": ["application/octet-stream"],
        "ali": ["application/vnd.sap-document", "application/octet-stream"],
        "als": ["application/vnd.ableton.live-set", "application/x-ableton-live-set", "application/octet-stream"],
        "amd": ["application/octet-stream"],
        "amu": ["application/octet-stream"],
        "amf": ["model/amf", "application/amf", "application/octet-stream"],
        "anb": ["application/vnd.i2.analyst-notebook", "application/octet-stream"],
        "ani": ["application/x-navi-animation", "image/x-ani", "application/octet-stream"],
        "anm": ["video/x-anim", "application/octet-stream"],
        "aon": ["application/octet-stream"],
        "ape": ["audio/ape", "audio/x-ape"],
        "apr": ["application/vnd.esri.arcview-project", "application/octet-stream"],
        "arj": ["application/arj", "application/x-arj"],
        "art": ["image/art", "image/x-art", "application/octet-stream"],
        "asax": ["application/octet-stream", "text/html"],
        "ascx": ["application/octet-stream", "text/html"],
        "ase": ["application/vnd.adobe.swatch-exchange", "application/octet-stream"],
        "asf": ["video/x-ms-asf", "application/vnd.ms-asf"],
        "asmx": ["application/octet-stream", "text/xml"],
        "aup": ["application/vnd.audacity.project", "application/x-audacity-project", "application/octet-stream"],
        "aup3": ["application/vnd.audacity.project3", "application/x-audacity-project", "application/octet-stream"],
        "avg": ["application/octet-stream"],
        "dt0": ["application/octet-stream"],
        "dt1": ["application/octet-stream"],
        "dt2": ["application/octet-stream"],
        "dted": ["application/octet-stream"],
        "max": ["application/octet-stream"],
        "min": ["application/octet-stream"],
        "aw": ["application/vnd.hp-advancedwrite", "application/octet-stream"],
        "awd": ["model/vnd.away3d.awd", "application/octet-stream"],
        "aws": ["application/octet-stream"],
        "awt": ["application/x-abiword-template", "application/xml", "application/octet-stream"],
        "axd": ["text/html", "application/octet-stream"],
        "b": ["text/x-c", "application/octet-stream"],
        "b3d": ["model/x-b3d", "application/octet-stream"],
        "bak": ["application/octet-stream"],
        "bcc": ["application/vnd.ms-works", "application/octet-stream"],
        "bdb": ["application/vnd.ms-works", "application/octet-stream"],
        "bdm": ["video/mp2t", "application/octet-stream"],
        "bdmv": ["video/mp2t", "application/octet-stream"],
        "bib": ["application/x-bibtex", "text/x-bibtex"],
        "bif": ["application/xml", "application/octet-stream"],
        "bik": ["video/x-bink", "application/octet-stream"],
        "bil": ["image/bil", "application/octet-stream"],
        "bilw": ["application/octet-stream"],
        "blw": ["application/octet-stream"],
        "bpw": ["application/octet-stream"],
        "btw": ["application/octet-stream"],
        "jgw": ["application/octet-stream"],
        "jpgw": ["application/octet-stream"],
        "pgw": ["application/octet-stream"],
        "rasterw": ["application/octet-stream"],
        "tfw": ["application/octet-stream"],
        "tifw": ["application/octet-stream"],
        "bim": ["application/octet-stream"],
        "bip": ["image/bip", "application/octet-stream"],
        "bknas": ["application/octet-stream"],
        "blend": ["application/x-blender", "application/octet-stream"],
        "blk": ["application/octet-stream"],
        "bmf": ["application/vnd.corel-gallery", "application/octet-stream"],
        "box": ["application/vnd.lotus-notes", "application/octet-stream"],
        "bp2": ["application/octet-stream"],
        "bpl": ["application/octet-stream"],
        "bp3": ["application/octet-stream"],
        "bps": ["application/vnd.ms-works", "application/octet-stream"],
        "bqy": ["application/vnd.briberyquery", "application/octet-stream"],
        "bsdiff": ["application/x-bsdiff", "application/octet-stream"],
        "bse": ["application/octet-stream"],
        "bsq": ["image/bsq", "application/octet-stream"],
        "btr": ["application/x-btrieve", "application/octet-stream"],
        "bup": ["application/octet-stream"],
        "ifo": ["application/octet-stream"],
        "bxt": ["application/octet-stream"],
        "bxu": ["application/octet-stream"],
        "bxy": ["application/octet-stream"],
        "sdk": ["application/octet-stream"],
        "shk": ["application/octet-stream"],
        "bz": ["application/x-bzip"],
        "c3d": ["model/c3d", "application/x-c3d", "application/octet-stream"],
        "c4d": ["application/vnd.maxon.cinema4d.project", "application/x-cinema4d", "application/octet-stream"],
        "cal": ["image/cals", "image/x-cals", "application/octet-stream"],
        "cam": ["image/x-casio-qv-cam", "image/cam", "application/octet-stream"],
        "cat": ["application/vnd.ms-pki.seccat", "application/octet-stream"],
        "catdrawing": ["application/vnd.ms-catia.catdrawing", "drawing/x-catia-drawing", "application/octet-stream"],
        "catmaterial": ["application/vnd.ms-catia.catmaterial", "application/octet-stream"],
        "catpart": ["application/vnd.ms-catia.catpart", "model/x-catia-part", "application/octet-stream"],
        "catproduct": ["application/vnd.ms-catia.catproduct", "model/x-catia-product", "application/octet-stream"],
        "cb7": ["application/x-cb7", "application/octet-stream"],
        "cba": ["application/x-cb7", "application/octet-stream"],
        "cbr": ["application/x-cb7", "application/octet-stream"],
        "cbt": ["application/x-cb7", "application/octet-stream"],
        "cbz": ["application/x-cb7", "application/octet-stream"],
        "cbd": ["application/octet-stream"],
        "cc3": ["application/octet-stream"],
        "cc5": ["application/octet-stream"],
        "cca": ["application/octet-stream"],
        "ccd": ["application/x-clonecd", "application/octet-stream"],
        "cce": ["application/octet-stream"],
        "cch": ["application/vnd.corel-chart", "application/x-corelchart", "application/octet-stream"],
        "cci": ["video/x-phantom-cine", "application/octet-stream"],
        "cd5": ["image/x-cd5", "image/vnd.chasys-draw", "application/octet-stream"],
        "cdt": ["application/vnd.corel-draw-template", "application/x-coreldraw-template", "application/octet-stream"],
        "cdx": ["application/vnd.corel-draw-compressed", "image/x-coreldraw", "application/octet-stream"],
        "cjw": ["application/vnd.corel-draw-compressed", "image/x-coreldraw", "application/octet-stream"],
        "ce3": ["application/octet-stream"],
        "cel": ["image/x-cel", "application/octet-stream"],
        "cfg": ["application/octet-stream", "text/plain"],
        "ch3": ["application/vnd.harvard-graphics", "application/x-harvard-graphics", "application/octet-stream"],
        "chi": ["application/x-chiwriter", "application/octet-stream"],
        "cht": ["application/vnd.harvard-graphics", "application/x-harvard-graphics", "application/octet-stream"],
        "cif": ["chemical/x-cif", "application/octet-stream"],
        "cin": ["application/octet-stream"],
        "cl5": ["application/x-roxio-easycdcreator", "application/octet-stream"],
        "rcl": ["application/x-roxio-easycdcreator", "application/octet-stream"],
        "clb": ["application/octet-stream"],
        "clk": ["application/vnd.corel-rave", "application/x-corelrave", "application/octet-stream"],
        "clr": ["application/octet-stream"],
        "cml": ["chemical/x-cml", "application/xml"],
        "cmo": ["application/octet-stream"],
        "nmo": ["application/octet-stream"],
        "nms": ["application/octet-stream"],
        "vmo": ["application/octet-stream"],
        "cmp": ["image/x-lead-cmp", "application/octet-stream"],
        "cmx": ["image/x-cmx", "application/vnd.corel-presentation-exchange", "application/octet-stream"],
        "cnt": ["application/vnd.ms-htmlhelp", "application/octet-stream"],
        "cos": ["application/octet-stream"],
        "cpc": ["image/x-cpc", "application/octet-stream"],
        "cpi": ["image/x-cpc", "application/octet-stream"],
        "cpd": ["application/vnd.corel-printhouse", "application/octet-stream"],
        "cph": ["application/vnd.corel-printhouse", "application/octet-stream"],
        "cpg": ["application/octet-stream", "text/plain"],
        "cps": ["application/vnd.corel-photohouse", "application/octet-stream"],
        "cpt": ["image/x-corelphotopaint", "application/vnd.corel-photopaint", "image/cpt"],
        "cpx": ["application/vnd.corel-draw-compressed", "image/x-coreldraw", "application/octet-stream"],
        "cql": ["application/sparql-query", "application/x-cypher-query", "text/plain"],
        "cr3": ["image/x-canon-cr3", "image/cr3", "application/octet-stream"],
        "cram": ["application/cram", "application/octet-stream"],
        "crd": ["application/x-mscardfile", "application/octet-stream"],
        "cri": ["image/x-cintel-raw", "application/octet-stream"],
        "dvcc": ["image/x-cintel-raw", "application/octet-stream"],
        "crt": ["application/x-c64-crt", "application/octet-stream"],
        "ctb": ["application/acad", "application/octet-stream"],
        "ctx": ["application/octet-stream"],
        "ct": ["image/x-scitex-ct", "application/octet-stream"],
        "sct": ["image/x-scitex-ct", "application/octet-stream"],
        "cue": ["application/x-cue", "text/plain"],
        "cus": ["application/octet-stream"],
        "cut": ["image/x-drhalo-cut", "application/octet-stream"],
        "cva": ["application/vnd.hp-cva", "application/octet-stream"],
        "cvx": ["audio/x-covox-adpcm", "application/octet-stream"],
        "v2s": ["audio/x-covox-adpcm", "application/octet-stream"],
        "v3s": ["audio/x-covox-adpcm", "application/octet-stream"],
        "v4s": ["audio/x-covox-adpcm", "application/octet-stream"],
        "v8": ["audio/x-covox-adpcm", "application/octet-stream"],
        "vmf": ["audio/x-covox-adpcm", "application/octet-stream"],
        "cwk": ["application/vnd.claris-works", "application/x-clarisworks", "application/octet-stream"],
        "czi": ["image/vnd. Zeiss.czi", "application/octet-stream"],
        "data": ["application/octet-stream"],
        "dat": ["text/x-mork", "application/octet-stream"],
        "mab": ["text/x-mork", "application/octet-stream"],
        "msf": ["text/x-mork", "application/octet-stream"],
        "db": ["application/x-paradox-db", "application/octet-stream"],
        "dbc": ["application/vnd.ms-foxpro-dbc", "application/octet-stream"],
        "dbf": ["application/dbf", "application/x-dbf", "application/vnd.foxpro"],
        "dbg": ["application/octet-stream", "text/plain"],
        "dbq": ["application/acad", "application/octet-stream"],
        "dbt": ["application/acad", "application/octet-stream"],
        "dbx": ["application/vnd.ms-foxpro-dbx", "application/octet-stream"],
        "dca": ["application/dca-rft", "text/plain"],
        "dct": ["application/vnd.ms-foxpro-dct", "application/octet-stream"],
        "dc": ["application/x-designcad", "application/octet-stream"],
        "dc2": ["application/x-designcad", "application/octet-stream"],
        "ddd": ["application/octet-stream"],
        "ddoc": ["application/vnd.docuware.platform.skxml", "application/xml"],
        "dds": ["image/vnd.ms-dds", "image/dds", "application/octet-stream"],
        "dem": ["application/octet-stream"],
        "des": ["application/octet-stream"],
        "dff": ["audio/x-dff", "audio/dff", "application/octet-stream"],
        "dfn": ["application/octet-stream"],
        "dgn": ["image/vnd.dgn", "application/x-microstation-dgn", "application/octet-stream"],
        "dia": ["application/x-dia-diagram", "application/xml"],
        "dic": ["application/octet-stream", "text/plain"],
        "did": ["application/octet-stream"],
        "dif": ["text/tab-separated-values", "application/dif", "application/octet-stream"],
        "dm3": ["application/x-gatan-dm3", "application/octet-stream"],
        "dox": ["application/vnd.wordperfect", "application/msword", "application/octet-stream"],
        "dpp": ["application/vnd.serif.drawplus", "application/octet-stream"],
        "dqy": ["application/vnd.ms-excel.odbcquery", "application/octet-stream"],
        "drw": ["image/x-micrografx-drw", "application/vnd.micrografx.draw", "application/octet-stream"],
        "ds2": ["audio/vnd.dss", "audio/x-ds2", "application/octet-stream"],
        "ds_store": ["application/octet-stream"],
        "dsf": ["image/x-micrografx-designer", "application/vnd.micrografx.designer", "application/octet-stream"],
        "dss": ["audio/x-dss", "audio/vnd.dss", "application/octet-stream"],
        "dtb": ["application/octet-stream"],
        "dtp": ["application/vnd.gst-publisher", "application/octet-stream"],
        "dvb": ["application/vnd.ms-vb.macro", "application/octet-stream"],
        "dvf": ["audio/x-sony-dvf", "application/octet-stream"],
        "msv": ["audio/x-sony-dvf", "application/octet-stream"],
        "dw2": ["application/x-designcad-windows", "application/octet-stream"],
        "dwb": ["application/vnd.varicad", "application/x-varicad", "application/octet-stream"],
        "dws": ["application/acad", "application/vnd.autocad.dws", "application/octet-stream"],
        "dwt": ["application/vnd.autocad.dwt", "application/x-autocad-template", "application/acad"],
        "dxl": ["application/vnd.domino.xml", "application/xml", "application/octet-stream"],
        "dxx": ["application/octet-stream"],
        "dzt": ["application/octet-stream"],
        "e00": ["application/vnd.esri.e00", "application/octet-stream"],
        "e01": ["application/vnd.esri.e00", "application/octet-stream"],
        "e02": ["application/vnd.esri.e00", "application/octet-stream"],
        "e03": ["application/vnd.esri.e00", "application/octet-stream"],
        "e04": ["application/vnd.esri.e00", "application/octet-stream"],
        "e05": ["application/vnd.esri.e00", "application/octet-stream"],
        "e06": ["application/vnd.esri.e00", "application/octet-stream"],
        "e07": ["application/vnd.esri.e00", "application/octet-stream"],
        "e08": ["application/vnd.esri.e00", "application/octet-stream"],
        "e09": ["application/vnd.esri.e00", "application/octet-stream"],
        "e10": ["application/vnd.esri.e00", "application/octet-stream"],
        "e11": ["application/vnd.esri.e00", "application/octet-stream"],
        "e12": ["application/vnd.esri.e00", "application/octet-stream"],
        "e13": ["application/vnd.esri.e00", "application/octet-stream"],
        "e14": ["application/vnd.esri.e00", "application/octet-stream"],
        "e15": ["application/vnd.esri.e00", "application/octet-stream"],
        "e16": ["application/vnd.esri.e00", "application/octet-stream"],
        "e17": ["application/vnd.esri.e00", "application/octet-stream"],
        "e18": ["application/vnd.esri.e00", "application/octet-stream"],
        "e19": ["application/vnd.esri.e00", "application/octet-stream"],
        "e20": ["application/vnd.esri.e00", "application/octet-stream"],
        "x00": ["application/vnd.esri.e00", "application/octet-stream"],
        "eaf": ["application/xml", "application/x-eaf+xml"],
        "ebcdic": ["application/octet-stream", "text/plain"],
        "ecw": ["image/ecw", "image/x-ecw", "application/octet-stream"],
        "ega": ["image/x-ega", "application/octet-stream"],
        "gx2": ["image/x-ega", "application/octet-stream"],
        "eio": ["application/vnd.eioffice.document", "application/octet-stream"],
        "elf": ["application/x-elf", "application/octet-stream"],
        "o": ["application/x-elf", "application/octet-stream"],
        "enf": ["application/x-endnote-filter", "application/octet-stream"],
        "enl": ["application/x-endnote-library", "application/octet-stream"],
        "enlx": ["application/x-endnote-compressed-library", "application/zip"],
        "err": ["application/octet-stream", "text/plain"],
        "ers": ["application/octet-stream"],
        "etf": ["application/vnd.finale-etf", "application/octet-stream"],
        "evp": ["application/octet-stream"],
        "evy": ["application/envoy"],
        "ewl": ["application/octet-stream", "text/xml"],
        "ex_": ["application/octet-stream", "application/vnd.installshield-executable"],
        "exclude": ["application/octet-stream", "text/plain"],
        "ezdraw": ["application/vnd.eazydraw.fileformat", "application/octet-stream"],
        "f01": ["audio/x-yamaha-wave", "application/octet-stream"],
        "s01": ["audio/x-yamaha-wave", "application/octet-stream"],
        "u01": ["audio/x-yamaha-wave", "application/octet-stream"],
        "w01": ["audio/x-yamaha-wave", "application/octet-stream"],
        "far": ["audio/x-farandole", "application/octet-stream"],
        "fbk": ["application/x-familytreemaker", "application/octet-stream"],
        "ftw": ["application/x-familytreemaker", "application/octet-stream"],
        "fbx": ["text/vnd.flographs", "application/vnd.autodesk.fbx"],
        "fc5": ["application/octet-stream"],
        "fcd": ["application/octet-stream"],
        "fcx": ["application/octet-stream"],
        "fdb": ["application/x-legacyfamilytree", "application/octet-stream"],
        "fdr": ["application/vnd.finaldraft", "application/x-final-draft", "application/octet-stream"],
        "feather": ["application/vnd.apache.arrow.file", "application/octet-stream"],
        "ff": ["image/x-farbfeld", "application/octet-stream"],
        "fft": ["application/vnd.ibm.modcap", "application/octet-stream"],
        "fh3": ["image/x-freehand", "application/vnd.adobe.freehand"],
        "fif": ["application/octet-stream", "image/fif"],
        "fig": ["application/vnd.matlab.figure", "application/octet-stream"],
        "mat": ["application/vnd.matlab.figure", "application/octet-stream"],
        "flc": ["video/x-flc", "application/vnd.autodesk.flc"],
        "flextext": ["application/xml", "application/octet-stream"],
        "fli": ["video/x-fli", "application/vnd.autodesk.fli"],
        "flm": ["application/octet-stream"],
        "flo": ["application/vnd.rfflow", "application/octet-stream"],
        "flp": ["audio/x-flp", "application/x-flstudio-project", "application/octet-stream"],
        "flr": ["application/octet-stream"],
        "fls": ["application/vnd.faro.frs", "application/octet-stream"],
        "fm1": ["application/vnd.lotus-1-2-3", "application/octet-stream"],
        "fmt": ["application/vnd.lotus-1-2-3", "application/octet-stream"],
        "fm3": ["application/vnd.lotus-1-2-3", "application/octet-stream"],
        "fmp": ["application/acad", "application/octet-stream"],
        "fmp12": ["application/vnd.filemaker"],
        "fmv": ["application/octet-stream"],
        "fnt": ["application/octet-stream", "font/opentype"],
        "fol": ["application/vnd.pfs-firstchoice", "application/octet-stream"],
        "fos": ["application/octet-stream"],
        "fpt": ["application/vnd.ms-foxpro-memo", "application/octet-stream"],
        "frt": ["application/vnd.ms-foxpro-memo", "application/octet-stream"],
        "pjt": ["application/vnd.ms-foxpro-memo", "application/octet-stream"],
        "vct": ["application/vnd.ms-foxpro-memo", "application/octet-stream"],
        "frx": ["application/vnd.ms-foxpro-report", "application/octet-stream"],
        "fw3": ["application/vnd.framemaker", "application/octet-stream"],
        "fw4": ["application/vnd.framemaker", "application/octet-stream"],
        "fws": ["application/vnd.faro.fws", "application/octet-stream"],
        "fw": ["application/vnd.framemaker", "application/octet-stream"],
        "fw2": ["application/vnd.framemaker", "application/octet-stream"],
        "g41": ["application/x-g64-disk-image", "application/octet-stream"],
        "g64": ["application/x-g64-disk-image", "application/octet-stream"],
        "g71": ["application/x-g64-disk-image", "application/octet-stream"],
        "g9b": ["image/x-g9b", "application/octet-stream"],
        "gb": ["text/plain", "application/vnd.genbank"],
        "gbk": ["text/plain", "application/vnd.genbank"],
        "gc6": ["application/octet-stream"],
        "gdb": ["application/x-interbase-gdb", "application/octet-stream"],
        "ged": ["text/gedcom", "application/x-gedcom"],
        "gem": ["image/x-gem", "application/octet-stream"],
        "gen": ["application/octet-stream"],
        "gfc": ["application/octet-stream"],
        "gfi": ["application/octet-stream"],
        "gfs": ["application/vnd.ogr.gfs+xml", "application/xml"],
        "gis": ["image/x-erdas-gis", "application/octet-stream"],
        "gjf": ["chemical/x-gaussian-input", "text/plain"],
        "gmn": ["application/vnd.garmin.tracklog+xml", "application/gpx+xml", "application/octet-stream"],
        "gpl": ["application/x-gimp-palette", "text/plain"],
        "gpx": ["application/gpx+xml"],
        "gra": ["application/octet-stream"],
        "gun": ["image/x-gunpaint", "application/octet-stream"],
        "hd": ["application/octet-stream"],
        "hln": ["application/octet-stream"],
        "hlp": ["application/winhlp", "application/x-winhelp"],
        "hm": ["application/octet-stream"],
        "hmi": ["application/octet-stream"],
        "hq.uef": ["application/octet-stream"],
        "uef": ["application/octet-stream"],
        "hqx": ["application/mac-binhex40", "application/binhex"],
        "htc": ["text/x-component", "text/html"],
        "htx": ["text/html"],
        "hvif": ["image/x-haiku-hvif", "application/vnd.haiku-hvif"],
        "hwp": ["application/x-hwp", "application/vnd.hancom.hwp"],
        "ib3": ["application/octet-stream"],
        "ibi": ["application/octet-stream"],
        "icons": ["application/octet-stream"],
        "swatches": ["application/octet-stream"],
        "idq": ["application/x-idq", "text/plain"],
        "idw": ["application/vnd.intellidraw", "application/octet-stream"],
        "ies": ["application/vnd.iesna-lm-63", "text/plain"],
        "ifc": ["model/ifc", "application/x-step", "application/ifc"],
        "ifcXML": ["application/xml", "model/ifc+xml"],
        "iff": ["image/x-iff", "application/x-iff"],
        "ige": ["application/octet-stream"],
        "ili": ["application/vnd.interlis.ili+xml", "application/xml"],
        "im": ["image/x-applix-image", "application/octet-stream"],
        "img": ["image/x-gem", "application/octet-stream"],
        "iMovieProj": ["application/vnd.apple.iwork", "application/octet-stream"],
        "indb": ["application/vnd.adobe.indesign-book", "application/octet-stream"],
        "indl": ["application/vnd.adobe.indesign-library", "application/octet-stream"],
        "info": ["text/plain", "application/xml"],
        "ing": ["image/x-intergraph-raster", "application/octet-stream"],
        "iob": ["application/octet-stream"],
        "ipynb": ["application/x-ipynb+json", "application/json"],
        "iqy": ["application/vnd.ms-excel.iqy", "text/plain"],
        "isdoc": ["application/vnd.isdoc+xml", "application/xml"],
        "isdocx": ["application/vnd.isdocx+zip", "application/zip"],
        "isf": ["application/vnd.inspiration.isf", "application/octet-stream"],
        "isi": ["application/octet-stream"],
        "it": ["audio/x-it"],
        "itf": ["application/vnd.interlis.itf+xml", "application/xml"],
        "iv": ["model/inventor", "application/x-inventor"],
        "ivc": ["application/vnd.microsoft.expressionmedia", "application/octet-stream"],
        "jam": ["audio/x-jam", "application/octet-stream"],
        "jbf": ["application/octet-stream"],
        "jdf": ["application/vnd.jeol.jdf", "text/plain"],
        "jls": ["image/jls", "image/vnd.ms-photo"],
        "jnt": ["application/vnd.ms-windows-journal", "application/octet-stream"],
        "jtp": ["application/vnd.ms-windows-journal", "application/octet-stream"],
        "jsonld": ["application/ld+json"],
        "jwc": ["application/octet-stream"],
        "jwl": ["application/octet-stream"],
        "jws": ["application/vnd.jasco.jws", "text/plain"],
        "jw": ["application/vnd.justwrite", "application/octet-stream"],
        "jwt": ["application/vnd.justwrite", "application/octet-stream"],
        "key": ["application/vnd.apple.keynote", "application/x-iwork-keynote-sffkey"],
        "l01": ["application/vnd.logical-file-evidence", "application/octet-stream"],
        "las": ["application/vnd.las", "application/octet-stream"],
        "lbm": ["image/x-lbm", "image/lbm"],
        "lck": ["application/octet-stream"],
        "ldif": ["text/x-ldif", "application/ldif"],
        "leo": ["image/x-leo", "application/octet-stream"],
        "lft": ["application/octet-stream"],
        "lgs": ["application/vnd.leica.lgs", "application/octet-stream"],
        "lha": ["application/x-lzh-compressed", "application/lha"],
        "lzh": ["application/x-lzh-compressed", "application/lha"],
        "lib": ["application/octet-stream"],
        "lic": ["application/octet-stream", "text/plain"],
        "lin": ["application/acad", "text/plain"],
        "lit": ["application/vnd.ms-reader", "application/x-msreader"],
        "lli": ["application/octet-stream"],
        "lmd": ["application/octet-stream"],
        "lmu": ["application/octet-stream"],
        "lng": ["application/octet-stream", "text/xml"],
        "lnk": ["application/x-ms-shortcut", "application/octet-stream"],
        "lnr": ["application/octet-stream"],
        "lpd": ["application/vnd.avery-labelpro", "application/octet-stream"],
        "lpk": ["application/vnd.ms-lpk", "application/octet-stream"],
        "lrf": ["application/vnd.sony.bbemf", "application/octet-stream"],
        "lst": ["application/octet-stream", "text/plain"],
        "lt": ["application/octet-stream"],
        "ltt": ["application/octet-stream"],
        "lw2": ["application/vnd.lightwright", "application/octet-stream"],
        "lw3": ["application/vnd.lightwright", "application/octet-stream"],
        "lw4": ["application/vnd.lightwright", "application/octet-stream"],
        "lw5": ["application/vnd.lightwright", "application/octet-stream"],
        "lw6": ["application/vnd.lightwright", "application/octet-stream"],
        "lw": ["application/vnd.lightwright", "application/octet-stream"],
        "lw1": ["application/vnd.lightwright", "application/octet-stream"],
        "m2t": ["video/mp2t"],
        "m2ts": ["video/mp2t"],
        "ts": ["video/mp2t"],
        "mac": ["image/x-macpaint", "image/macpaint"],
        "mak": ["application/octet-stream", "text/plain"],
        "map": ["application/vnd.mapsforge.map", "application/octet-stream"],
        "mbk": ["application/octet-stream"],
        "mbx": ["application/mbox"],
        "vmbx": ["application/mbox"],
        "mc6": ["application/octet-stream"],
        "mcc": ["application/vnd.maccaption.mcc", "application/octet-stream"],
        "mcd": ["application/vnd.mathcad", "application/x-mathcad"],
        "md5": ["text/md5", "application/octet-stream"],
        "mda": ["application/x-msaccess"],
        "mdb": ["application/x-msaccess"],
        "mdf": ["application/octet-stream", "text/plain"],
        "mds": ["application/octet-stream", "text/plain"],
        "mdw": ["application/x-msaccess", "application/vnd.ms-access"],
        "mei": ["application/mei+xml", "application/xml"],
        "mesh": ["model/mesh", "application/octet-stream"],
        "met": ["application/vnd.os2-met-presentation-manager", "image/x-met"],
        "mg1": ["application/octet-stream"],
        "mg2": ["application/octet-stream"],
        "mg4": ["application/octet-stream"],
        "mg8": ["application/octet-stream"],
        "mhl": ["application/xml", "text/xml"],
        "mig": ["image/x-mig", "application/octet-stream"],
        "mk3d": ["video/x-matroska"],
        "mka": ["video/x-matroska"],
        "mks": ["video/x-matroska"],
        "mkv": ["video/x-matroska"],
        "mmm": ["application/vnd.font-adobe-mmm", "application/octet-stream"],
        "mnc": ["application/acad", "application/octet-stream"],
        "mnl": ["application/acad", "text/plain"],
        "mnr": ["application/acad", "application/octet-stream"],
        "mnt": ["application/acad", "application/octet-stream"],
        "mns": ["application/acad", "text/plain"],
        "mnu": ["application/acad", "text/plain"],
        "mod": ["audio/x-mod", "application/octet-stream"],
        "model": ["audio/x-mod", "application/octet-stream"],
        "mpcatalog": ["application/octet-stream"],
        "mpj": ["application/vnd.minitab.project", "application/octet-stream"],
        "mpl": ["video/mp2t", "application/vnd.avchd.playlist"],
        "mpls": ["video/mp2t", "application/vnd.avchd.playlist"],
        "msc": ["application/vnd.ms-msc", "application/octet-stream"],
        "mswmm": ["application/vnd.ms-windows-movie-maker", "application/octet-stream"],
        "mtl": ["model/mtl", "text/plain"],
        "mtm": ["audio/x-multitracker-module", "application/octet-stream"],
        "mtp": ["application/vnd.minitab.portable-worksheet", "application/octet-stream"],
        "mtw": ["application/vnd.minitab.worksheet", "application/octet-stream"],
        "mus": ["audio/x-finale-mus", "application/vnd.finale"],
        "musx": ["audio/x-archimedes-tracker", "application/octet-stream"],
        "mvb": ["application/x-msmediaview"],
        "mve": ["application/octet-stream"],
        "mvex": ["application/octet-stream"],
        "mxd": ["application/vnd.esri.mxd", "application/octet-stream"],
        "mxt": ["application/vnd.esri.mxd", "application/octet-stream"],
        "mxi": ["image/vnd.maxwell.mxi", "application/octet-stream"],
        "mxm": ["application/vnd.maxwell.mxm", "application/octet-stream"],
        "mxmf": ["audio/vnd.tma.xmf", "audio/mobile-xmf"],
        "xmf": ["audio/vnd.tma.xmf", "audio/mobile-xmf"],
        "mxs": ["application/vnd.maxwell.mxs", "application/octet-stream"],
        "myi": ["application/x-myisam-indexes", "application/octet-stream"],
        "nab": ["application/vnd.novell.addressbook", "application/octet-stream"],
        "nap": ["image/naplps", "application/octet-stream"],
        "ncd": ["application/vnd.nero.ncd", "application/octet-stream"],
        "ndt": ["application/octet-stream"],
        "nfo": ["text/plain", "application/octet-stream"],
        "nib": ["application/x-next-nib", "application/octet-stream"],
        "nic": ["image/x-neodisk-icon", "application/octet-stream"],
        "nii": ["application/vnd.nifti", "image/x-nifti"],
        "nit": ["application/octet-stream"],
        "nlm": ["application/vnd.novell.netware-loadable-module", "application/octet-stream"],
        "nlq": ["application/octet-stream"],
        "nl": ["application/octet-stream"],
        "nlt": ["application/octet-stream"],
        "nrg": ["application/x-nrg", "application/octet-stream"],
        "nrrd": ["application/vnd.nrrd", "image/x-nrrd"],
        "nsi": ["application/x-nsis", "application/octet-stream"],
        "nsv": ["video/x-nsv"],
        "numbers": ["application/vnd.apple.numbers", "application/x-iwork-numbers-sffnumbers"],
        "nut": ["video/x-nut", "application/octet-stream"],
        "nv": ["application/x-nmrview", "application/octet-stream"],
        "nwc": ["application/vnd.autodesk.navisworks", "application/octet-stream"],
        "nwd": ["application/vnd.autodesk.navisworks", "application/octet-stream"],
        "obd": ["application/vnd.ms-office.binder", "application/octet-stream"],
        "obj": ["model/obj", "text/plain"],
        "obo": ["text/obo", "application/octet-stream"],
        "obt": ["application/vnd.ms-office.binder.template", "application/octet-stream"],
        "obz": ["application/vnd.ms-office.binder.wizard", "application/octet-stream"],
        "oc3": ["application/vnd.agisoft.oc3", "application/octet-stream"],
        "odb": ["application/vnd.oasis.opendocument.database", "application/vnd.sun.xml.base", "application/x-vnd.oasis.opendocument.database"],
        "odex": ["application/vnd.android.ota", "application/octet-stream"],
        "oggu": ["application/vnd.originlab.originproject"],
        "ogmu": ["application/vnd.originlab.originproject"],
        "ogwu": ["application/vnd.originlab.originproject"],
        "opju": ["application/vnd.originlab.originproject"],
        "okt": ["audio/x-oktalyzer", "application/octet-stream"],
        "olk": ["application/vnd.ms-outlook-addressbook", "application/octet-stream"],
        "opd": ["application/vnd.omnipage", "application/octet-stream"],
        "opf": ["application/vnd.obsidium.project", "application/octet-stream"],
        "ops": ["application/vnd.orgplus", "application/octet-stream"],
        "opx": ["application/vnd.orgplus", "application/octet-stream"],
        "opxt": ["application/vnd.orgplus", "application/octet-stream"],
        "oqy": ["application/vnd.ms-excel.olapquery", "application/octet-stream"],
        "p00": ["image/x-c64-p00", "application/octet-stream"],
        "p01": ["image/x-c64-p00", "application/octet-stream"],
        "p02": ["image/x-c64-p00", "application/octet-stream"],
        "p03": ["image/x-c64-p00", "application/octet-stream"],
        "p04": ["image/x-c64-p00", "application/octet-stream"],
        "p7": ["image/x-xv-thumbnail", "application/octet-stream"],
        "pab": ["application/vnd.ms-outlook-personaladdressbook", "application/octet-stream"],
        "paf": ["application/x-paf", "text/plain"],
        "pages": ["application/vnd.apple.pages", "application/x-iwork-pages-sffpages"],
        "pal": ["application/x-riff", "application/octet-stream"],
        "pam": ["image/x-portable-anymap", "image/pam"],
        "pat": ["application/octet-stream"],
        "pc2": ["application/acad", "application/octet-stream"],
        "pc3": ["application/vnd.hp-pc3", "application/acad", "application/octet-stream"],
        "pc6": ["application/octet-stream"],
        "pcd": ["image/x-photo-cd", "image/pcd"],
        "pcf": ["application/x-font-pcf", "font/pcf"],
        "pcg": ["application/vnd.autodesk.pointcloud.indexed", "application/octet-stream"],
        "pcp": ["application/acad", "application/octet-stream"],
        "pcs": ["image/x-pics", "application/octet-stream"],
        "pdd": ["application/vnd.adobe.photodeluxe", "image/vnd.adobe.photodeluxe", "application/octet-stream"],
        "pde": ["text/x-processing", "application/octet-stream"],
        "pdq": ["application/octet-stream"],
        "pdt": ["application/octet-stream"],
        "pdx": ["application/vnd.adobe.pdx", "application/octet-stream"],
        "pdz": ["application/octet-stream"],
        "xpdz": ["application/octet-stream"],
        "pea": ["application/x-pea", "application/octet-stream"],
        "pek": ["application/octet-stream"],
        "pfb": ["application/x-font-type1"],
        "pff": ["application/octet-stream"],
        "pfs": ["application/vnd.pfs", "application/octet-stream"],
        "pfsx": ["application/xml", "application/octet-stream"],
        "pgc": ["image/x-portfolio-graphics", "application/octet-stream"],
        "pgf": ["image/pgf", "application/octet-stream"],
        "pgr": ["image/x-powergraphics", "application/octet-stream"],
        "pix": ["image/x-pix", "application/octet-stream"],
        "pjx": ["application/vnd.ms-foxpro-project", "application/octet-stream"],
        "pk": ["audio/vnd.peak", "application/octet-stream"],
        "plb": ["application/vnd.ms-foxpro-library", "application/octet-stream"],
        "plc": ["application/octet-stream"],
        "plist": ["application/xml", "application/x-plist"],
        "plt": ["application/vnd.hp-plt", "application/plt", "application/octet-stream"],
        "ply": ["model/ply", "application/x-ply", "text/plain"],
        "pm3": ["application/vnd.adobe.pagemaker", "application/x-pagemaker"],
        "pmf": ["application/vnd.esri.pmf", "application/octet-stream"],
        "pn4": ["application/vnd.ms-persuasion", "application/octet-stream"],
        "pnt": ["image/x-macpaint", "image/macpaint"],
        "pod": ["application/vnd.oasis.opendocument.text-template", "application/octet-stream"],
        "por": ["application/x-spss-por", "application/octet-stream"],
        "pp4": ["image/x-picture-publisher", "application/octet-stream"],
        "pp5": ["image/x-picture-publisher", "application/octet-stream"],
        "ppf": ["image/x-picture-publisher", "application/octet-stream"],
        "ppi": ["application/vnd.ms-powerpoint.graphics", "application/octet-stream"],
        "ppp": ["application/vnd.serif.pageplus", "application/x-pageplus", "application/octet-stream"],
        "pr1": ["application/vnd.ms-persuasion", "application/octet-stream"],
        "pr2": ["application/vnd.ms-persuasion", "application/octet-stream"],
        "pr3": ["application/vnd.ms-persuasion", "application/octet-stream"],
        "pr4": ["application/vnd.lotus-freelance", "application/octet-stream"],
        "praat": ["text/plain", "application/x-praat-script"],
        "prapic": ["application/octet-stream"],
        "pre": ["application/vnd.lotus-freelance", "application/octet-stream"],
        "prf": ["application/vnd.ms-persuasion.interchange", "application/octet-stream"],
        "prj": ["text/plain", "application/octet-stream"],
        "prn": ["application/postscript", "application/octet-stream"],
        "project": ["application/vnd.ms-catia.project", "application/octet-stream"],
        "prs": ["application/vnd.lotus-freelance", "application/octet-stream"],
        "prx": ["application/octet-stream"],
        "psc": ["application/octet-stream"],
        "psf": ["application/postscript"],
        "psp": ["image/vnd.adobe.photoshop", "image/x-paintshoppro"],
        "psproj": ["application/vnd.theprintshop.project", "application/octet-stream"],
        "psw": ["application/vnd.pocketword", "application/octet-stream"],
        "pwd": ["application/vnd.pocketword", "application/octet-stream"],
        "psx": ["application/vnd.agisoft.project", "application/octet-stream"],
        "psz": ["application/vnd.agisoft.projectarchive", "application/zip"],
        "ptl": ["text/plain", "application/octet-stream"],
        "ptm": ["image/x-ptm", "application/octet-stream"],
        "pts": ["application/vnd.ptgui.project", "application/octet-stream"],
        "puz": ["application/vnd.ms-publisher.packaged", "application/octet-stream"],
        "pvd": ["application/octet-stream"],
        "pw": ["application/vnd.ms-works", "application/octet-stream"],
        "pwi": ["application/octet-stream"],
        "pwt": ["application/vnd.pocketword-template", "application/octet-stream"],
        "pyc": ["application/x-python-bytecode", "application/x-python-compiled"],
        "pzf": ["application/vnd.graphpad.prism.project", "application/octet-stream"],
        "pzm": ["application/vnd.graphpad.prism.macro", "application/octet-stream"],
        "q4": ["image/x-xld4", "application/octet-stream"],
        "q4d": ["application/x-xld4-data", "application/octet-stream"],
        "qbb": ["application/vnd.intu.qbo", "application/x-quickbooks-backup"],
        "qic": ["application/x-qic", "application/octet-stream"],
        "qs": ["application/x-qsplat-model", "application/octet-stream"],
        "qsd": ["application/octet-stream"],
        "qsl": ["application/octet-stream"],
        "qsm": ["application/octet-stream"],
        "qst": ["application/octet-stream"],
        "rdata": ["application/x-r-data", "application/octet-stream"],
        "rfi": ["application/octet-stream"],
        "rft": ["application/vnd.ibm.modcap", "text/plain"],
        "rge": ["application/octet-stream"],
        "rhtm": ["text/html", "application/x-eruby"],
        "rhtml": ["text/html", "application/x-eruby"],
        "rif": ["image/vnd.rn-realflash", "image/x-riff"],
        "rip": ["image/x-rip", "application/octet-stream"],
        "rla": ["image/x-rla", "application/octet-stream"],
        "rle": ["image/rle", "image/x-rle"],
        "rmd": ["application/vnd.red.metadata", "text/xml"],
        "rmgc": ["application/x-rootsmagic", "application/octet-stream"],
        "rnd": ["image/vnd.rn-realpix", "application/octet-stream"],
        "rox": ["application/vnd.roxio.data-project", "application/octet-stream"],
        "roxio": ["application/vnd.roxio.easy-media-creator-layout", "application/octet-stream"],
        "rp": ["application/octet-stream"],
        "rpt": ["application/octet-stream"],
        "rqy": ["application/vnd.ms-excel.oleobjects", "application/octet-stream"],
        "rsc": ["application/vnd.microstation.symbology-resource", "application/octet-stream"],
        "rsw": ["image/x-rsw", "application/octet-stream"],
        "rtn": ["image/vnd.red.thumbnail", "application/octet-stream"],
        "rvl": ["application/vnd.muvee.reveal-project", "application/octet-stream"],
        "rxd": ["application/vnd.borland-reflex", "application/octet-stream"],
        "s3m": ["audio/s3m", "audio/x-s3m"],
        "sa2": ["audio/x-sa2", "application/octet-stream"],
        "sat": ["model/vnd.acis.sat", "application/x-sat"],
        "sav": ["application/x-spss-sav", "application/octet-stream"],
        "sbf": ["application/vnd.septentrio.sbf", "application/octet-stream"],
        "sbk": ["application/vnd.asymetrix.toolbook", "application/octet-stream"],
        "tbk": ["application/vnd.asymetrix.toolbook", "application/octet-stream"],
        "sbn": ["application/vnd.esri.spatial-index", "application/octet-stream"],
        "sbx": ["application/vnd.esri.spatial-index", "application/octet-stream"],
        "scc": ["text/x-scc", "application/octet-stream"],
        "scd": ["application/vnd.ms-schedule", "application/octet-stream"],
        "scf": ["application/x-scf-seq", "application/octet-stream"],
        "scr": ["text/plain", "application/x-autocad-script"],
        "sdc": ["application/vnd.stardivision.calc", "application/x-starcalc"],
        "sdd": ["application/vnd.stardivision.impress", "application/x-starimpress"],
        "sdf": ["text/plain", "application/x-system-data-file"],
        "sdl": ["application/vnd.alias.sdl", "text/plain"],
        "sdr": ["application/vnd.smartdraw", "application/octet-stream"],
        "sds": ["application/vnd.lifetechnologies.sds", "application/octet-stream"],
        "sdw": ["image/vnd.ami.sdw", "application/octet-stream"],
        "segy": ["application/x-segy", "application/octet-stream"],
        "seq": ["video/x-seq", "application/octet-stream"],
        "ses": ["application/vnd.adobe.audition.session", "application/xml"],
        "sesx": ["application/vnd.adobe.audition.session+xml", "application/xml"],
        "set": ["application/vnd.sibelius.sound-set-definition", "application/octet-stream"],
        "sff": ["application/sff", "application/octet-stream"],
        "sfk": ["application/octet-stream"],
        "sfw": ["image/x-sfw", "application/vnd.seattle-filmworks"],
        "sfx": ["application/x-sfx", "application/octet-stream"],
        "sgt": ["application/vnd.directmusic-segment", "application/octet-stream"],
        "sh3": ["application/vnd.harvard-graphics", "application/octet-stream"],
        "sha1": ["text/plain", "application/x-sha1"],
        "sha256": ["text/plain", "application/x-sha256"],
        "sha512": ["text/plain", "application/x-sha512"],
        "shs": ["application/x-shs", "application/octet-stream"],
        "shw": ["application/vnd.harvard-graphics", "application/octet-stream"],
        "shx": ["application/acad", "font/shx"],
        "siard": ["application/vnd.siard", "application/zip"],
        "sib": ["application/vnd.recordare.sibelius", "application/x-sibelius"],
        "sid": ["image/vnd.scanit.sid", "application/octet-stream"],
        "sif": ["image/x-canon-sif", "application/octet-stream"],
        "sig": ["application/vnd.siegfried.signature", "text/plain"],
        "silo": ["model/vnd.silo", "application/octet-stream"],
        "sitx": ["application/x-stuffitx", "application/stuffitx"],
        "skf": ["application/vnd.autodesk.autosketch", "application/octet-stream"],
        "slb": ["application/acad", "application/octet-stream"],
        "slk": ["application/vnd.ms-excel.sheet.macroenabled.12", "text/spreadsheet"],
        "slv": ["audio/x-sony-slv", "application/octet-stream"],
        "smp": ["audio/x-smp", "application/octet-stream"],
        "snoop": ["application/vnd.tcpdump.pcap", "application/octet-stream"],
        "snp": ["application/vnd.ms-access.report", "application/octet-stream"],
        "snpdf": ["application/octet-stream"],
        "spa": ["application/vnd.thermofisher.omnic.spa", "application/octet-stream"],
        "spc": ["image/x-spectrum512-compressed", "application/octet-stream"],
        "sps": ["image/x-spectrum512-compressed", "application/octet-stream"],
        "spd": ["image/vnd.spritepad", "application/octet-stream"],
        "spp": ["application/vnd.serif.photoplus", "image/x-photoplus"],
        "spu": ["image/x-spectrum512-uncompressed", "application/octet-stream"],
        "spv": ["application/x-spss-spv", "application/octet-stream"],
        "spy": ["application/octet-stream"],
        "srt": ["application/x-subrip", "text/plain"],
        "ssd": ["application/vnd.sas.data", "application/x-sas-data"],
        "stb": ["application/acad", "application/octet-stream"],
        "std": ["application/vnd.surething.project", "application/octet-stream"],
        "stl": ["model/stl", "application/vnd.ms-pki.stl", "application/x-stl-ascii"],
        "stm": ["audio/x-stm", "application/octet-stream"],
        "stp": ["application/octet-stream"],
        "str": ["application/vnd.statsoft.statistica.report", "application/octet-stream"],
        "sty": ["application/vnd.directmusic-style", "application/octet-stream"],
        "svr": ["model/vnd.superscape.svr", "application/octet-stream"],
        "sw3": ["application/vnd.scriptware.script", "application/octet-stream"],
        "swc": ["application/vnd.adobe.swc", "application/zip"],
        "swm": ["application/x-ms-wim"],
        "wim": ["application/x-ms-wim"],
        "swp": ["application/octet-stream"],
        "sxg": ["image/x-sxg", "application/octet-stream"],
        "t64": ["application/x-t64", "application/octet-stream"],
        "taf": ["application/vnd.adrift.taf", "application/xml"],
        "tag": ["application/octet-stream"],
        "tap": ["application/x-tap", "application/octet-stream"],
        "tbl": ["application/vnd.pagemaker.tableeditor", "application/octet-stream"],
        "tcd": ["application/vnd.turbocalc", "application/octet-stream"],
        "tcr": ["application/x-tcr", "application/octet-stream"],
        "td": ["text/plain", "application/octet-stream"],
        "tdk": ["application/octet-stream"],
        "template": ["application/vnd.apple.iwork", "application/octet-stream"],
        "tg1": ["application/octet-stream"],
        "thn": ["image/vnd.graphic-workshop.thumbnail", "application/octet-stream"],
        "tid": ["application/vnd.avchd.thumbnail-index", "application/octet-stream"],
        "tip": ["image/x-tip", "application/octet-stream"],
        "tlb": ["application/x-ms-type-library", "application/octet-stream"],
        "tlm": ["application/vnd.timelinemaker", "application/octet-stream"],
        "tlm3": ["application/vnd.timelinemaker", "application/octet-stream"],
        "tlm4": ["application/vnd.timelinemaker", "application/octet-stream"],
        "tlmp": ["application/vnd.timelinemaker", "application/octet-stream"],
        "tls": ["application/vnd.agisoft.tiled-model", "application/octet-stream"],
        "tnd": ["application/octet-stream"],
        "trn": ["application/octet-stream"],
        "trp": ["image/x-atari-falcon-eggpaint", "application/octet-stream"],
        "trs": ["image/x-atari-falcon-truecolour-sprites", "application/octet-stream"],
        "tsg": ["application/vnd.thespectralgeologist.dataset", "application/octet-stream"],
        "txc": ["application/xml", "text/xml"],
        "tym": ["application/octet-stream"],
        "tzx": ["application/x-tzx", "application/octet-stream"],
        "u3d": ["model/u3d", "application/octet-stream"],
        "ucdx": ["application/vnd.cindex.document", "application/octet-stream"],
        "utpl": ["application/vnd.cindex.document", "application/octet-stream"],
        "ucsf": ["application/vnd.sparky", "application/octet-stream"],
        "udl": ["application/x-ms-udl", "text/plain"],
        "ulaw": ["audio/basic", "audio/ulaw"],
        "uue": ["text/x-uuencode", "application/octet-stream"],
        "vbp": ["application/vnd.ms-visualbasic.project", "text/plain"],
        "vbw": ["application/vnd.ms-visualbasic.workspace", "application/octet-stream"],
        "vcx": ["application/vnd.ms-foxpro-classlibrary", "application/octet-stream"],
        "vdi": ["application/x-virtual-disk-image", "application/octet-stream"],
        "vismat": ["application/xml", "text/xml"],
        "vlw": ["application/octet-stream"],
        "vms": ["application/vnd.vamas.vms", "text/plain"],
        "vob": ["video/mpeg", "video/x-ms-vob"],
        "voc": ["audio/x-creative-voice", "audio/voc"],
        "vox": ["model/vnd.magica-voxel", "application/octet-stream"],
        "vrt": ["application/vnd.ogc.vrt+xml", "text/xml"],
        "wab": ["application/vnd.ms-wab", "application/octet-stream"],
        "waf": ["application/octet-stream"],
        "wdb": ["application/vnd.ms-works", "application/octet-stream"],
        "webarchive": ["application/x-webarchive", "application/octet-stream"],
        "wfm": ["application/vnd.ms-works", "application/octet-stream"],
        "wi": ["image/x-corel-wavelet-compressed", "application/octet-stream"],
        "wvl": ["image/x-corel-wavelet-compressed", "application/octet-stream"],
        "wkq": ["application/vnd.quattropro", "application/octet-stream"],
        "wq1": ["application/vnd.quattropro", "application/octet-stream"],
        "wld": ["application/octet-stream"],
        "wls": ["application/vnd.602tab.spreadsheet", "application/octet-stream"],
        "wor": ["application/vnd.mapinfo.wor", "application/octet-stream"],
        "wpg": ["image/x-wpg", "application/x-wpg"],
        "wpl": ["application/vnd.wordperfect", "application/octet-stream"],
        "wpm": ["application/vnd.ms-word.macro", "application/msword"],
        "wps": ["application/vnd.ms-works", "application/octet-stream"],
        "wr3": ["application/vnd.wraptor.compressed", "application/octet-stream"],
        "wra": ["application/vnd.wraptor.compressed", "application/octet-stream"],
        "wri": ["application/mswrite", "application/x-mswrite"],
        "wrk": ["application/vnd.cakewalk.wrk", "application/octet-stream"],
        "ws": ["application/msword", "text/plain"],
        "ws5": ["application/msword", "text/plain"],
        "x3d": ["model/x3d+xml", "application/vnd.hzn-3d-crossword"],
        "xar": ["application/x-xar", "application/vnd.xara"],
        "xb": ["application/octet-stream"],
        "xbf": ["application/vnd.ms-xaml+binary", "application/octet-stream"],
        "xer": ["application/vnd.primavera.xer", "text/xml"],
        "xlb": ["application/vnd.ms-excel.toolbar", "application/octet-stream"],
        "xlg": ["text/plain", "application/octet-stream"],
        "xlk": ["application/vnd.ms-excel.backup", "application/octet-stream"],
        "xlr": ["application/vnd.ms-works", "application/octet-stream"],
        "xmcd": ["application/vnd.mathcad.xmcd", "application/xml"],
        "xtf": ["application/vnd.interlis.xtf+xml", "application/xml"],
        "xwma": ["audio/vnd.ms-wma.xwma", "audio/x-ms-xwma"],
        "xy": ["application/vnd.xywrite", "text/plain"],
        "xy3": ["application/vnd.xywrite", "text/plain"],
        "xy4": ["application/vnd.xywrite", "text/plain"],
        "xyp": ["application/vnd.xywrite", "text/plain"],
        "xyw": ["application/vnd.xywrite", "text/plain"],
        "xz": ["application/x-xz"],
        "yal": ["application/octet-stream"],
        "ydl": ["application/vnd.yaodl+xml", "application/xml"],
        "yenc": ["application/x-yenc", "text/plain"],
        "z": ["application/x-compress", "application/x-zcompressed"],
        "z3d": ["model/z3d", "application/octet-stream"],
        "zbd": ["application/octet-stream"],
        "zdl": ["application/vnd.avery-designpro", "application/octet-stream"],
        "zdp": ["application/vnd.avery-designpro", "application/octet-stream"],
        "zexp": ["application/vnd.zope.export", "application/octet-stream"],
        "zif": ["image/vnd.zoomify.zif", "application/octet-stream"],
        "zmt": ["application/vnd.zbrush.matcap", "application/octet-stream"],
        "zoo": ["application/x-zoo", "application/octet-stream"],
        "zpaq": ["application/x-zpaq", "application/octet-stream"],
    }

    static defined(value) {
        return (value !== null && value !== undefined);
    }

    static definedAndNotBlank = (txt) => {
        return !!txt && txt.trim().length > 0
    }

    static hasSourceId(source) {
        return source && Api.defined(source.sourceId) && "" + source.sourceId !== "0" && "" + source.sourceId !== ""
    }

    static pretty_version() {
        const parts = window.ENV.version.split(".");
        if (parts.length === 3 || parts.length === 4) {
            return parts[0] + "." + parts[1] + " (build " + parts[2] + ")";
        }
        return window.ENV.version;
    }

    // download an object with session
    static do_fetch(url, session_id) {
        if (!session_id || session_id.length === 0)
            session_id = "";

        fetch(url, {headers: {"session-id": session_id}})
            .then((response) => response.blob())
            .then((blob) => { // RETRIEVE THE BLOB AND CREATE LOCAL URL
                const _url = window.URL.createObjectURL(blob);
                window.open(_url, "_blank").focus(); // window.open + focus
            }).catch((error) => {
                if (error.response === undefined) {
                    alert('Servers not responding or cannot contact Servers');
                } else {
                    alert(get_error(error));
                }
            }
        )
    }

    // generate a guid
    static createGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    static formatSizeUnits(bytes) {
        if (bytes >= 1073741824) {
            bytes = (bytes / 1073741824).toFixed(2) + " GB";
        } else if (bytes >= 1048576) {
            bytes = (bytes / 1048576).toFixed(2) + " MB";
        } else if (bytes >= 1024) {
            bytes = (bytes / 1024).toFixed(2) + " KB";
        } else if (bytes > 1) {
            bytes = bytes + " bytes";
        } else if (bytes === 1) {
            bytes = bytes + " byte";
        } else {
            bytes = "0 bytes";
        }
        return bytes;
    };

    // convert unix timestamp to string if it's for a reasonable time in the future
    static unixTimeConvert(timestamp) {
        if (timestamp > 1000) {
            const a = new Date(timestamp);
            const year = a.getUTCFullYear();
            const month = a.getUTCMonth() + 1;
            const date = a.getUTCDate();
            const hour = a.getUTCHours();
            const min = a.getUTCMinutes();
            const sec = a.getUTCSeconds();
            return year + '/' + Api.pad2(month) + '/' + Api.pad2(date) + ' ' + Api.pad2(hour) + ':' + Api.pad2(min) + ':' + Api.pad2(sec);
        }
        return "";
    }

    // get current time in milliseconds
    static getSystemTime() {
        return new Date().getTime();
    }

    // convert a date object to an iso date string
    static toIsoDate(date) {
        if (!date || !date.getFullYear) {
            date = new Date()
        }
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return year + '-' + Api.pad2(month) + '-' + Api.pad2(day) + 'T00:00:00.000';
    }

    // convert a date object to an iso date string
    static toIsoDateTime(date) {
        if (!date || !date.getFullYear) {
            date = new Date()
        }
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let offset_hours = 0; // date.getTimezoneOffset() / 60;
        let hour = date.getHours() + offset_hours;
        if (hour < 0) hour += 24;
        if (hour >= 24) hour -= 24;
        return year + '-' + Api.pad2(month) + '-' + Api.pad2(day) + 'T' + Api.pad2(hour) + ':00:00.000';
    }

    // convert a date object to an iso date string
    static toPrettyDateTime(date) {
        if (!date || isNaN(date))
            return "invalid date";
        if (!date || !date.getFullYear) {
            date = new Date()
        }
        const year = date.getFullYear();
        if (isNaN(year))
            return "invalid date";
        const month = date.getMonth() + 1;
        const day = date.getDate();
        if (isNaN(month))
            return "invalid date";
        let offset_hours = 0; // date.getTimezoneOffset() / 60;
        let hour = date.getHours() + offset_hours;
        if (hour < 0) hour += 24;
        if (hour >= 24) hour -= 24;
        let mins = date.getMinutes();
        let secs = date.getSeconds();
        return year + '/' + Api.pad2(month) + '/' + Api.pad2(day) + ' ' + Api.pad2(hour) + ":" + Api.pad2(mins) + ":" + Api.pad2(secs);
    }

    static pad2(item) {
        return ("" + item).padStart(2, '0');
    }

    // set up the timer
    static setupTimer() {
        return true;
    }

    // merge two notifications lists together and return the resulting unique list of items
    static merge_notifications(original, list) {
        const seen = {};
        const new_list = [];
        if (original) {
            for (const item of original) {
                seen[item.id] = true;
                new_list.push(item);
            }
        }
        if (list) {
            for (const item of list) {
                if (!seen.hasOwnProperty(item.id)) {
                    seen[item.id] = true;
                    new_list.push(item);
                }
            }
        }
        return new_list;
    }

    // start a password reset request
    static passwordResetRequest(email, success, fail) {
        if (email && email.length > 0) {
            Comms.http_post('/auth/reset-password-request', {"email": email},
                (response) => {
                    success(response.data.session, response.data.user)
                },
                (errStr) => {
                    fail(errStr)
                }
            )
        } else {
            fail('you must provide your SimSage email address');
        }
    };

    // reset a password (do it)
    static resetPassword(email, newPassword, reset_id, success, fail) {
        if (email && email.length > 0 && newPassword.length > 0) {
            const payload = {"email": email, "password": newPassword, "resetId": reset_id};
            Comms.http_post('/auth/reset-password', payload,
                (response) => {
                    success(response.data.session, response.data.user)
                },
                (errStr) => {
                    fail(errStr)
                }
            )
        } else {
            fail('please complete and check all fields');
        }
    };

    // get the user object (or null if dne)
    static getUser() {
        var user = localStorage.getItem("user");
        if (user && user.startsWith("{")) {
            return JSON.parse(user);
        }
        return null;
    }

    // upload data to the system
    static uploadDocument(payload, success, fail) {
        Comms.http_put('/document/upload', payload,
            (response) => {
                success(response.data)
            },
            (errStr) => {
                fail(errStr)
            }
        )
    };

    // perform a semantic search
    static semanticSearch(organisationId, kb_id, keywords, num_results = 10, score_threshold = 0.1, success, fail) {
        Comms.http_put('/semantic/search', {
                organisationId: organisationId,
                kbId: kb_id,
                botQuery: keywords,         // raw text
                superSearch: keywords,      // super search markup
                numResults: num_results,
                scoreThreshold: score_threshold,
            },
            (response) => {
                success(response.data)
            },
            (errStr) => {
                fail(errStr)
            }
        )
    }

    // write text to the clipboard, if we can
    static writeToClipboard(text) {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
            return true;
        }
        return false;
    }

    //return array of pretty roles
    static getPrettyRoles(roles) {
        return roles.map(role => {
            return {'role': role, 'label': this.getPrettyRole(role)}
        })
    }

    // pretty print a role
    static getPrettyRole(role) {
        // 'admin', 'dms', 'manager'
        if (role === 'admin') return "SimSage Administrator";
        else if (role === 'dms') return "DMS User";
        else if (role === 'manager') return "Organisational Manager";
        else if (role === 'discover') return "Discover User";
        else if (role === 'tagger') return "Search Tagger";
        else if (role === 'teacher') return "Result Influencer";
        else if (role === 'stepwise') return "Stepwise User";
        else if (role === 'api') return "API User";
        else if (role === 'search') return "Search User";
        else return role;
    }

    // convert a list of strings into a list of DocumentAcl types
    static stringListToACLList(str_list) {
        const acl_list = [];
        if (str_list) {
            for (const name of str_list) {
                acl_list.push({"acl": name, "access": "R", isUser: false})
            }
        }
        return acl_list;
    }

}

// convert js response to its error output equivalent
export function get_error(action) {
    const str1 = action?.error?.message?.toString() ?? '';
    const str2 = action?.payload?.error?.toString() ?? action?.payload?.message?.toString() ?? '';
    const str3 = action?.type?.toString() ?? '';
    const str4 = action?.payload?.response?.data?.error ?? '';
    let final_str = "";
    if (str1 !== '') {
        final_str += str1;
    }
    if (str2 !== '') {
        if (final_str !== '')
            final_str += ", " + str2;
        else
            final_str = str2;
    }
    if (str3 !== '') {
        if (final_str !== '')
            final_str += " (" + str3 + ")";
        else
            final_str = str3;
    }
    if (str4 !== '') {
        if (final_str !== '')
            final_str += "\n\n" + str4;
        else
            final_str = str4;
    }
    return final_str;
}

export const get_cookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
    return undefined
}

export const get_cookie_value = (cookie_name, key) => {
    const cookie_value = get_cookie(cookie_name)
    const cookie_data = cookie_value
        ? Object.fromEntries(
            cookie_value.split('&').map(item => item.split('='))
        )
        : {}
    if (cookie_data.hasOwnProperty(key)) return cookie_data[key]
    return undefined
}

export const set_cookie = (name, value, days) => {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

export const update_cookie_value = (cookie_name, key, new_value) => {
    const cookie_value = get_cookie(cookie_name)
    const cookie_data = cookie_value
        ? Object.fromEntries(
            cookie_value.split('&').map(item => item.split('='))
        )
        : {}
    cookie_data[key] = new_value
    const updated_value = Object.entries(cookie_data)
        .map(([k, v]) => `${k}=${v}`)
        .join('&')
    set_cookie(cookie_name, updated_value, 360)
}

// SM-2094 - make sure / isn't in the URL and is "null" if empty or null
// filter is allowed to by null
export const filter_esc = (filter) => {
    if (filter) {
        filter = ('' + filter).replace(/\//g, ' ').trim()
        if (filter.length < 1) {
            filter = 'null'
        }
        return encodeURIComponent(filter)
    }
    return 'null'
}

// SM-2094 - make sure / isn't in the URL, uri_part is allowed to be null
export const uri_esc = (uri_part) => {
    if (uri_part) {
        uri_part = ('' + uri_part).replace(/\//g, ' ').trim()
        return encodeURIComponent(uri_part)
    }
    return uri_part
}

/**
 * Converts a GMT/UTC epoch time to local time
 * @param {number} epoch_time - the epoch time to convert
 * @returns {number} - The corresponding time as a local time.
 */
export const convert_gmt_to_local = (epoch_time) => {
    const time = epoch_time - (Api.tz_offset * 3600_000)
    if (time > 1000) {
        return time
    }
    return epoch_time
}

export const limit = (text, max_length = 22) => {
    if (text && text.length > max_length) {
        return text.substring(0, max_length) + "..."
    }
    return text
}

// display "how long ago" in English this task finished.
// epoch is in server time, so only use GMT here (Date.now())
export function age(epoch, now) {
    const secondsAgo = Math.floor((now - epoch) / 1000);
    if (secondsAgo <= 0) return ""
    if (secondsAgo < 60) {
        if (secondsAgo === 1) return "one second";
        return `${secondsAgo} seconds`;
    }
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
        if (minutesAgo === 1) return "one minute";
        return `${minutesAgo} minutes`;
    }
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
        if (hoursAgo === 1) return "one hour";
        return `${hoursAgo} hours`;
    }
    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo === 1) return "one day";
    return `${daysAgo} days`;
}

export default Api;
