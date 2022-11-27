# highlightjs-jcl
highlight.js grammar for Job Control Language (JCL)

## Status
draft

## build Highlight.js

1. clone <code>highlight.js</code> repository (follow highlight.js instructions)
2. clone this repository into a different directory
3. create a symbolic link of the highlightjs-jcl directory into the highlight.js extra directory: <code>ln -sr ./highlightjs-jcl/ ./highlight.js/extra/</code>
4. enter into highlight.js directory and run: <code>npm install</code>
5. build your highlight.js
   1. jcl only language: <code>node tools/build -n jcl</code>
   2. all languages: <code>node tools/build</code>

the highlight.js package will be built into the <code>build/</code> path
