exports.wedges = {
    "test": {
        "search": function(query) {
            var results = [];
            for (var i=0; i<query.length; i++) {
                var result = query.substr(0, i + 1);
                results.push({
                    "uri": result,
                    "title": result
                });
            }
            return results;
        },
        "action": function(uri) {
            return alert(`wedgit-test0/test: ${uri}`)
        }
    },

    "test2": {
        "search": function(query) {
            return [{
                "uri": "wedgit-test0/test2: test",
                "title": "wedgit-test0/test2: test"
            }];
        },
        "action": function(uri) {
            return alert(`wedgit-test0/test2: ${uri}`)
        }
    },

    "test3": {
        "__search": function(query) {
            return [{
                "uri": "wedgit-test1/test3",
                "title": "wedgit-test1/test3"
            }];
        },
        "__action": function(uri) {
            return alert(`wedgit-test1/test3: ${uri}`)
        }
    },
}