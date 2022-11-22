/*
Language: JCL (Job Control Language)
Author: Carlo Ferraro <>
Description: Grammar highlight for JCL scripts
Website: https://en.wikipedia.org/wiki/Job_Control_Language
*/

export default function(hljs) {
    const KEYWORDS = [ 'ALIAS',
        'ALTER',
        'ALTERNATEINDEX',
        'ALTSEQ',
        'AVGREC',
        'BLDINDEX',
        'BLKSIZE',
        'BURST',
        'CDAY',
        'CDD',
        'CDDD',
        'CDDMMYY',
        'CHH',
        'CHHMM',
        'CHHMMSSX',
        'CLASS',
        'CLUSTER',
        'CMM',
        'CMMYY',
        'CNTL',
        'CNVTCAT',
        'COMMAND',
        'CONNECT',
        'COPY',
        'COUNT',
        'CWW',
        'CWWD',
        'CYMD',
        'CYY',
        'CYYDDD',
        'CYYMM',
        'CYYMMDD',
        'CYYYY',
        'CYYYYMM',
        'DCB',
        'DEBUG',
        'DEFAULTS',
        'DEFINE',
        'DELETE',
        'DISCONNECT',
        'DISP',
        'DISPLAY',
        'DSN',
        'DSORG',
        'DUMMY',
        'DYNAM',
        'ELSE',
        'END',
        'ENDCNTL',
        'ENDIF',
        'EXAMINE',
        'EXEC',
        'EXPORT',
        'EXPORTRA',
        'GDG',
        'GENERATIONDATAGROUP',
        'IF',
        'IMPORT',
        'IMPORTRA',
        'INCLUDE',
        'INREC',
        'JCLLIB',
        'JOB',
        'KEYLEN',
        'LABEL',
        'LIKE',
        'LISTCAT',
        'LISTCRA',
        'LRECL',
        'MERGE',
        'MODE',
        'MODS',
        'MSGCLASS',
        'MSGLEVEL',
        'NONVSAM',
        'NOTIFY',
        'OCCUR',
        'OMIT',
        'OPTION',
        'OUTFIL',
        'OUTPUT',
        'OUTREC',
        'PAGESPACE',
        'PATH',
        'PEND',
        'PGM',
        'PRINT',
        'PROC',
        'RANGE',
        'RECFM',
        'RECORD',
        'REGION',
        'REPRO',
        'RESETCAT',
        'SELECT',
        'SET',
        'SORT',
        'SPACE',
        'STATS',
        'STORCLAS',
        'SUM',
        'THEN',
        'UNIQUE',
        'UNIT',
        'USERCATALOG',
        'VERIFY',
        'VOLUME',
        'XMIT'
    ];
    const LITERALS = [
        'OLD',
        'NEW',
        'MOD',
        'KEEP',
        'CATLG',
        'DELETE',
        'FB',
        'CYL',
        'TRK'
    ];
    const DD_PARMS = [
        '*',
        'ACCODE',
        'AMP',
        'AVGREC',
        'BLKSIZE',
        'BLKSZLIM',
        'BURST',
        'CCSID',
        'CHARS',
        'CHKPT',
        'CNTL',
        'COPIES',
        'DATA',
        'DATACLAS',
        'DCB',
        'DDNAME',
        'DEST',
        'DISP',
        'DLM',
        'DSID',
        'DSKEYLBL',
        'DSNAME',
        'DSNTYPE',
        'DUMMY',
        'DYNAM',
        'EATTR',
        'EXPDT',
        'FCB',
        'FILEDATA',
        'FLASH',
        'FREE',
        'FREEVOL',
        'GDGORDER',
        'HOLD',
        'KEYLABL1',
        'KEYLABL2',
        'KEYENCD1',
        'KEYENCD2',
        'KEYLEN',
        'KEYOFF',
        'LABEL',
        'LGSTREAM',
        'LIKE',
        'LRECL',
        'MAXGENS',
        'MGMTCLAS',
        'MODIFY',
        'OUTLIM',
        'OUTPUT',
        'PATH',
        'PATHDISP',
        'PATHMODE',
        'PATHOPTS',
        'PROTECT',
        'RECFM',
        'RECORG',
        'REFDD',
        'RETPD',
        'RLS',
        'ROACCESS',
        'SECMODEL',
        'SEGMENT',
        'SPACE',
        'SPIN',
        'STORCLAS',
        'SUBSYS',
        'SYMBOLS',
        'SYMLIST',
        'SYSOUT',
        'TERM',
        'UCS',
        'UNIT',
        'VOLUME'
    ]
    const OPC_KEYWORDS = [
        'SETVAR',
        'SCAN'
    ];
    const STRINGS = {
        className: 'string',
        begin: '\'',
        end: '\'',
        illegal: '\\n'
    };
    const VARIABLES = {
        className: 'variables',
        begin: '&[0-9a-zA-Z]',
        end: '.',
        relevance: 0
    }

    // FIX subparameters parameters like: DCB=(RECFM=FB,LRECL=80,BLKSIZE=2000)
    const PARAMS = {
        className: 'params',
        keywords: DD_PARMS,
        begin: /[0-9a-zA-Z.]*=/,
        end: '[,]?',
        contains: [
            {
                className: 'subparameter',
                begin: /\(/,
                end: /\)/,
                contains: [ "self" ]
            },
            {
                className: 'values',
                begin: /[&]?[0-9a-zA-Z.\*]+/,
                end: ''
            }
        ],
        relevance: 0
    };

    // FIX not recognized
    const CONT_STMT = {
        className: 'continuation',
        begin: /\/\/\s+(.*)\b/,
        end: /$/,
        contains: [
            PARAMS
        ],
        relevance: 0
    }

    // FIX use
    const NUMBERS = {
        className: 'number',
        begin: '\\b(0b[01\']+)',
        end: ''
    };

    // FIX multiline stmt (see CONT_STMT)
    const JOB_STMT = {
        className: 'JOB statement',
        begin: /\/\/[a-zA-Z0-9\$\#\@][a-zA-Z0-9\$\#\@\s]{1,7}? JOB/,
        end: '',
        contains: [
            /*JCL_STEP*/
            PARAMS,
            CONT_STMT
        ],
        relevance: 10
    };

    // FIX Multiline DD (see CONT_STMT)
    const DD_CARD = {
        className: 'DD card',
        begin: /\/\/[A-Z0-9\$\#\@][A-Z0-9\ \$\#\@]{1,7}? DD /,
        end: /$/,
        contains: [
            PARAMS,
            CONT_STMT
        ],
        relevance: 0
    };
    const JCL_STEP = {
        className: 'JCL step',
        variants: [
            { begin: /\/\/[A-Z0-9\$\#\@][A-Z0-9\$\#\@\ ]{1,7}? EXEC/ },
            { begin: /\/\/[A-Z0-9\$\#\@][A-Z0-9\$\#\@\ ]{1,7}? PROC/ }
        ],
        end: /$/,
        keywords: { keyword: 'EXEC PROC' },
        contains: [
            DD_CARD
            /*,
            { endsWithParent: true }*/
        ]
    };

    // FIX Unrecognized directive
    const OPC_DIRECTIVE = {
        className: 'OPC directive',
        begin: /\/\/\*%OPC/,
        end: '',
        keywords: { OPC_KEYWORDS },
        contains: [
            PARAMS,
            {
                className: 'subparameter',
                begin: /\(/,
                end: /\)/,
                contains: [ "self" ]
            }
        ],
        relevance: 1
    };

    // FIX Unrecognized directive
    const OPC_PDIRECTIVE = {
        className: 'OPC processed directive',
        begin: /\/\/\>\%OPC/,
        relevance: 0
    }


    return {
        name: 'JCL',
        case_insensitive: false,
        keywords: {
            keyword: KEYWORDS,
            literal: LITERALS
        },
        contains: [
            JOB_STMT,
            JCL_STEP,
            DD_CARD,
            CONT_STMT,
            OPC_DIRECTIVE,
            OPC_PDIRECTIVE,
            VARIABLES,
            PARAMS,
            hljs.COMMENT('\\/\\/\\*[^%+](.*)', '', { relevance: 0 }),
            STRINGS
        ]
 /*       contains: [
            {
                className: 'JOB statement',
                begin: '\/\/[a-zA-Z0-0\$\#\@]{1,8}? JOB',
                relevance: 10
            },
            {
                className: 'OPC directive',
                begin: '\/\/\*\%OPC',
                excludeEnd: true,
                relevance: 0
            },
            {
                className: 'OPC processed directive',
                begin: '\/\/\>\%OPC',
                excludeEnd: true,
                relevance: 0
            },
            {
                className: 'variables',
                begin: '&[0-9a-zA-Z]',
                end: '.',
                relevance: 0
            },
            {
                className: 'param',
                begin: '=&?[0-9a-zA-Z.]*',
                end: '',
                relevance: 0
            },
            hljs.COMMENT('\\/\\/\\*[^%+](.*?)', '\\n', { relevance: 0 })
            // The following regular expressions solves three purposes
            // - Identify Temp Variables in JCL (e.g. &&TEMP)
            // - Symbolic variables in JCL (e.g. &SYSUID)
            // - TWS OPC Variables (e.g. %OPC)
            // Thanks to Simon for pointing me to this
            //     0 => '&amp;&amp;[a-zA-Z]{1,8}[0-9]{0,}',
            // 1 => '&amp;[a-zA-Z]{1,8}[0-9]{0,}',
            // 2 => '&amp;|\?|%[a-zA-Z]{1,8}[0-9]{0,}'
        ],*/
    }
}
