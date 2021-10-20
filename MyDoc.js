import fs from 'fs';
import babelParser from '@babel/parser';
import DocBuilder from './DocBuilder.js';
import HtmlBuilder from './HtmlBuilder.js';

const fileName = 'Note.js';
const fileContent = fs.readFileSync ( fileName, 'utf8' );

const parserOptions = {
    allowAwaitOutsideFunction: true,
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    plugins: [
        // 'asyncGenerators',
        // 'bigInt',
        // 'classPrivateMethods',
        // 'classPrivateProperties',
        // 'classProperties',
        ['decorators', {
            decoratorsBeforeExport: true
        }],
        'doExpressions',
        // 'dynamicImport',
        // 'estree',
        'exportDefaultFrom',
        // 'exportNamespaceFrom',
        'functionBind',
        // 'functionSent',
        'importMeta',
        // 'jsx',
        // 'logicalAssignment',
        // 'nullishCoalescingOperator',
        // 'numericSeparator',
        // 'objectRestSpread',
        // 'optionalCatchBinding',
        // 'optionalChaining',
        ['pipelineOperator', {
            proposal: 'minimal'
        }],
        'throwExpressions'
    ],
    ranges: true,
    sourceType: 'module'
};

const ast = babelParser.parse(fileContent , parserOptions );

const doc = new DocBuilder ( ).build ( ast, fileName );

new HtmlBuilder ( ).build ( doc );

// fs.writeFileSync( fileName + '.json', JSON.stringify ( doc ) );

console.log ( 'Document parsed' );
