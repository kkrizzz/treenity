(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("codemirror/lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["codemirror/lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    CodeMirror.defineOption("keyword", {}, function(cm, val, prev) {
        if (prev == CodeMirror.Init) prev = false;
        if (prev && !val)
            cm.removeOverlay("keyword");
        else if (!prev && val)
            cm.addOverlay({
                token: function(stream) {
                        const matchArray = stream.match(/<Render[\s\S]*\/>/);
                        if (matchArray != null) {
                            const match = matchArray[0];
                            stream.match(match);
                            return "render-highlight"
                        }
                        while (stream.next() != null && !stream.match(/<Render[\s\S]*\/>/, false)) {}
                        return null;
                },
                name: "keyword"
            });
    });
});