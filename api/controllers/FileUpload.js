const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const readChunk = require("read-chunk");
const fileType = require("file-type");
const config = require("config").get("uploadConfig");
const VidControl = require("../helpers/VideoControl");
const ErrorResponse = require("../helpers/ErrorResponse");
const SuccuessResponse = require("../helpers/SuccessResponse");
const getVideoInfo = require("get-video-info");
const uuidv1 = require("uuid/v1");
const Bounce = require("bounce");

exports.UploadFile = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(config.UPLOAD_DIR)) {
      fs.mkdirSync(config.UPLOAD_DIR);
    }
    let files = [];
    let Extensions = ["png", "jpg", "jpeg", "gif", "mp4"];
    const form = new formidable.IncomingForm();

    form.multiples = true;
    form.uploadDir = config.UPLOAD_DIR;
    form.maxFileSize = config.MAX_FILE_SIZE;
    form.on("file", async (name, file) => {
      try {
        let filesize = parseInt(file.size);

        if (files.length === config.MAX_FILE_COUNT) {
          fs.unlink(file.path, function() {
            return new ErrorResponse(400, "Maximum number of files exceeded!");
          });
          //return true;
        }
        let type = null;
        let filename = "";
        let buffer = await readChunk(file.path, 0, config.CHUNK_SIZE);

        //if (err) return new ErrorResponse(400, err);
        type = fileType(buffer);
        if (type !== null && Extensions.includes(type.ext)) {
          if (type.ext === "mp4" && filesize > config.MAX_VID_SIZE) {
            Reporter(files, file, "", fs, type, false, "Invalid file size");
          } //Img files
          else if (type.ext !== "mp4" && filesize > config.MAX_IMG_SIZE) {
            Reporter(files, file, "", fs, type, false, "Invalid file size");
          } else {
            filename = uuidv1() + path.extname(file.name);
            fs.rename(
              file.path,
              path.join(config.UPLOAD_DIR, filename),
              err => {
                if (err) return new ErrorResponse(400, err);
              }
            );

            Reporter(files, file, filename, fs, type, true, "Upload Ok");
          }
        } else {
          Reporter(files, file, "", fs, type, false, "Invalid file type");
        }
        console.log("Checking");
        Check_Files(files, res, resolve);
      } catch (e) {
        Bounce.rethrow(e, "system");
        return e;
      }
    });

    await form.parse(req, async () => {
      //console.log(files);
      //await Check_Files(files, res);
    });

    form.on("error", err => {
      Bounce.rethrow(err, "system");
      return new ErrorResponse(
        400,
        "Error occurred during processing - " + err
      );
    });
    form.on("end", () => {
      console.log("finished");
    });
  });
};
const Check_Files = async (files, res, Resolve) => {
  // let i = 0;
  VidFiles = files.filter(item => item.status && item.type == "mp4");
  if (VidFiles.length == 0) {
    Resolve(new SuccuessResponse("Upload finished successfully!", files));
  } else
    return new Promise((resolve, reject) => {
      VidFiles.forEach(item => {
        getVideoInfo(path.join(config.UPLOAD_DIR, item.destfilename)).then(
          info => {
            if (info.format.duration > config.MAX_VID_DURATION) {
              item.status = false;
              item.message = "Invalid duration";
            } else if (
              parseInt(VidControl.GetQuality(info)) > config.MAX_VID_QUALITY
            ) {
              item.status = false;
              item.message = "Invalid Quality";
            } else if (!VidControl.IsAspectRatioValid(info)) {
              item.status = false;
              item.message = "Invalid Aspect Ratio";
            }
            console.log(item);
            Resolve(
              new SuccuessResponse("Upload finished successfully!", files)
            );

            // i++;
            // if (i == VidFiles.length) res.status(200).json(files);
          }
        );
      });
    });
};

const Reporter = (files, file, destfilename, fs, type, status, message) => {
  files.push({
    status: status,
    sourcefilename: file.name,
    destfilename: destfilename,
    type: type.ext,
    size: file.size,
    message: message
  });

  if (!status)
    fs.unlink(file.path, err => {
      if (err) console.log("ERROR: " + err);
    });
};
