// Create objects for Utils conversion
SPOC.Utils.Yammer = {};

/**
 * Matches references with messages and returns tidier data object
 * @params  array obj Yammer feed Object
 * @return  array
 */
SPOC.Utils.Yammer.formatFeedResponse = function(data) {
    var i;
    for (i = 0; i < data.messages.length; i++) {
        if (data.messages[i].sender_type && data.messages[i].sender_type === 'user') {
            data.messages[i].user = SPOC.Utils.Arrays.findByProperty(data.references, 'id', data.messages[i].sender_id);
        }
    }
    return data.messages;
};