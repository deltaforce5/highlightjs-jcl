/*
Language: JCL (Job Control Language)
Author: Carlo Ferraro <>
Description: Grammar highlight for JCL scripts
Website: https://en.wikipedia.org/wiki/Job_Control_Language
*/

export default function(hljs) {
    const CARD_NAME_RE = '[A-Z0-9\d\$\#\@ ]{1,8}?';
    const KEYWORDS = 'CNTL COMMAND DD ELSE ENDCNTL ENDIF EXEC IF JCLLIB JOB OUTPUT PEND PROC SET THEN XMIT ';
    const DD_KEYWORDS = '* ACCODE AMP AVGREC BLKSIZE BLKSZLIM BURST CCSID CHARS CHKPT CNTL COPIES DATA DATACLAS DCB ' +
                        'DDNAME DEST DISP DLM DSID DSKEYLBL DSNAME DSNTYPE DUMMY DYNAM EATTR EXPDT FCB FILEDATA FLASH '+
                        'FREE FREEVOL GDGORDER HOLD KEYLABL1 KEYLABL2 KEYENCD1 KEYENCD2 KEYLEN KEYOFF LABEL LGSTREAM ' +
                        'LIKE LRECL MAXGENS MGMTCLAS MODIFY OUTLIM OUTPUT PATH PATHDISP PATHMODE PATHOPTS PROTECT ' +
                        'RECFM RECORG REFDD RETPD RLS ROACCESS SECMODEL SEGMENT SPACE SPIN STORCLAS SUBSYS SYMBOLS ' +
                        'SYMLIST SYSOUT TERM UCS UNIT VOLUME ';
    const DD_LITERALS = 'CATLG CYL DELETE FB KEEP NEW OLD PASS RLSE SHR SL TRK VB ';
    const JOB_KEYWORDS = 'ADDRSPC BYTES CARDS CCSID CLASS COND DSENQSHR GROUP JESLOG JOBRC LINES MEMLIMIT MSGCLASS ' +
                        'MSGLEVEL NOTIFY PAGES PASSWORD PERFORM PRTY RD REGION RESTART SECLABEL SCHENV SYSAFF SYSTEM ' +
                        'TIME TYPRUN UJOBCORR USER ' ;
    const OPC_KEYWORDS = 'BEGIN END SCAN SETFORM SETVAR CDATE CTIME OCDATE OCFRSTC OCFRSTW OCFRSTWY OCLASTC OCLASTW ' +
                        'OCLASTWY OCTIME OPIADATE OPIATIME OPLSDATE OPLSTIME OPC ';
    const OPC_LITERALS = 'OADID OADOWNER OAUGROUP OCALID ODAY ODD ODDD ODMY1 ODMY2 OETCRIT OETEVNM OETGGEN OETGROOT ' +
                        'OETJNUM OETJOBN OETTYPE OFREEDAY OHH OHHMM OMM OMMYY OWW OWWD OWWLAST OWWMONTH OYMD OYM ' +
                        'OYMD1 OYMD2 OYMD3 OYY OYYDDD OYYMM OYYYY OJOBNAME OLDAY OLDD OLHH OLHHMM OLMD OLMM OLWK ' +
                        'OLYMD OLYYDDD OOPNO OWSID OXJOBNAM CDAY CDD CDDD CDDMMYY CFREEDAY CHH CHHMM CHHMMSS CHHMMSSX ' +
                        'CMM CMMYY CWW CWWD CYMD CYY CYYDDD CYYMM CYYMMDD CYYYY CYYYYMM SETUP SUBMIT ';
    const NUMBERS_QUANTIFIERS = 'M K WD CD WK MO YR HH MM SS';
    const JES2_CTRL_KEYWORDS = 'JOBPARM MESSAGE NETACCT NOTIFY OUTPUT PRIORITY ROUTE SETUP SIGNOFF SIGNON XEQ XMIT ';

    const STRINGS = {
        className: 'string',
        begin: '\'',
        end: '\'',
        illegal: '\\n'
    };

    const NUMBERS = {
        className: 'number',
        match: '\\b[\\d\']+('.concat(NUMBERS_QUANTIFIERS.replace('\ ', '|') + ')?\\b'),
        relevance: 0
    };

    const PUNCTUATION = {
        className: 'punctuation',
        keywords: '( ) = & , ^ ! < >',
        relevance: 0
    };

    const VARIABLES = {
        className: 'variables',
        match: /&[&]?[A-Z0-9]+/,
        relevance: 0
    }

    const COMMENT_INLINE = {
        className: 'comment',
        begin: /--/,
        end: /$/,
        relevance: 0
    };

    const DD_INSTREAM = {
        className: 'meta',
        begin: /\s*\*[.\n]*/,
        end: /\/(.*?)\n/,
        relevance: 0
    }

    const PARAMS = {
        className: 'params',
        keywords: {
            keyword: DD_KEYWORDS + JOB_KEYWORDS + OPC_KEYWORDS,
            literal: DD_LITERALS + OPC_LITERALS,
            $pattern: /\w+/
        },

        begin: [
            /[A-Z\d\$\#\@]*/,
            /=/
        ],
        end: /[,]?/,
        beginScope: {
            1: 'keyword',
            2: 'punctuation'
        },
        contains: [
            'self',
            VARIABLES,
            NUMBERS,
            STRINGS,
            {
                className: 'values',
                keywords: {
                    keyword: DD_KEYWORDS + JOB_KEYWORDS + OPC_KEYWORDS,
                    literal: DD_LITERALS + OPC_LITERALS
                },
                variants: [
                    { begin: /[\w\d.\*]+/, end: '' },
                    { begin: /\(/, end: /\)/ }
                ],
                contains: [ 'self', VARIABLES, NUMBERS, STRINGS ]
            },
            STRINGS
        ],
        relevance: 0
    };

    const JES2_CTRL_STMT = {
        className: 'JES2 control statement',
        keywords: JES2_CTRL_KEYWORDS,
        begin: /^\/\*[A-Z]+\b/,
        end: /$/,
        contains: [
            PARAMS,
            COMMENT_INLINE
        ]
    };

   const OPC_DIRECTIVE = {
        className: 'OPC directive',
        begin: /\/\/\*(%|>)OPC/,
        end: /$/,
        keywords: OPC_KEYWORDS,
        contains: [
            PARAMS,
            COMMENT_INLINE
        ]
    };

    const JCLCARD = {
        className: 'jclcard',
        begin: [
            /^\/\//,
            CARD_NAME_RE,
            /\s{1}/,
            /(.*?)/
        ],
        beginScope: {
            2: 'symbol'
        },
        end: /$/,
        keywords: {
            keyword: KEYWORDS,
            literal: DD_LITERALS
        },
        contains: [
            PARAMS,
            DD_INSTREAM
        ]
    }

    return {
        name: 'JCL',
        case_insensitive: false,
        contains: [
            OPC_DIRECTIVE,
            hljs.COMMENT( /^\/\/\*[^%>]/, /$/ ),
            JES2_CTRL_STMT,
            JCLCARD,
            STRINGS
        ]
    }
}
