exports.wedges = {
    "test2": {
        "search": function(query) {
            return [{
                "uri": "wedgit-test1/test2",
                "title": "wedgit-test1/test2"
            }];
        },
        "action": function(uri) {
            return alert(`wedgit-test1/test2: ${uri}`)
        }
    },

    "test3": {
        "search": function(query) {
            return ["a", "b"];
        },
        "action": function(uri) {
            return alert(`wedgit-test1/test3: ${uri}`)
        }
    },
}