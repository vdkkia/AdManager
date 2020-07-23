exports.IsAspectRatioValid = function (info) {
    var Height = info.streams[0].height;
    var Width = info.streams[0].width;
    console.log(Width / Height == 16 / 9);
    return Width / Height == 16 / 9 || Width / Height == 4 / 3;

};

exports.GetQuality = function (info) {
    return info.streams[0].width;
};