const express = require("express");
const mysql = require("mysql");
const config = require("./dbConfig.js");
const bcrypt = require("bcrypt");
const path = require("path");
const upload = require("./uploadConfig.js");
const { send } = require("process");
const { CONNREFUSED } = require("dns");
const { time } = require("console");

const app = express();
const con = mysql.createConnection(config);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/index.html"));
});

app.post("/SignUp", function (req, res) {
    const { username, password, email, role } = req.body;
    const sql = "SELECT user_Name FROM users WHERE user_Name=?";
    con.query(sql, [username], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            if (result.length != 0) {
                res.status(401).send("Already have this username.");
            } else {
                // res.send("can signup");
                bcrypt.hash(password, 10, function (err, hash) {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Enpassword error");
                    } else {
                        const sql = "INSERT INTO users (user_Name , user_Password , user_Email , user_Role) VALUES (?,?,?,?)";
                        con.query(sql, [username, hash, email, role], function (err, result) {
                            if (result.affectedRows != 1) {
                                console.log(err);
                                res.status(500).send("Database error");
                            } else {
                                res.send("/Admin");
                            }
                        });
                    }

                });
            }
        }
    });


});

app.post("/SignIn", function (req, res) {
    const { username, password } = req.body;
    // res.send("test");
    const sql = "SELECT user_ID , user_Password , user_Role FROM users WHERE user_Name=?";
    con.query(sql, [username], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            if (result.length != 1) {
                res.status(401).send("Username wrong");
            } else {
                bcrypt.compare(password, result[0].user_Password, function (err, resp) {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Compare error");
                    } else if (resp) {
                        res.send(result);
                    } else {
                        res.status(401).send("Password wrong");
                    }
                });
                // res.send(result);
            }
        }
    });
});

app.get("/Profile", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/profile.html"));
});

app.post("/DatasomeID", function (req, res) {

});

app.get("/Contact", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/contact.html"));
});

app.get("/DataPlan", function (req, res) {

});

app.get("/Admin", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/Admin.html"))
});

app.get("/DetailPlan", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/Detailplan.html"));
});

app.get("/Filter", function (req, res) {
    res.sendFile(path.join(__dirname, "/view/Filter.html"));
})

app.post("/DataPlace", function (req, res) {
    const request_type = req.body.type;
    console.log(request_type);
    if (request_type == undefined) {
        const sql = "SELECT * FROM place";
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send("Database error");
            } else {
                res.send(result);
            }
        });
    } else if (request_type == 1) {
        const sql = "SELECT place.placeID , place.name_place , place.pic_place , place.info_place , place.price_place , place.timeopen_place , place.timeclose_place , place.CloseDay , place.typeplaceID , typeplace.typeplaceID , typeplace.nametype_place FROM place , typeplace WHERE place.typeplaceID = typeplace.typeplaceID AND place.typeplaceID = 1";
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send("Database error");
            } else {
                res.send(result);
            }
        });
    } else if (request_type == 2) {
        const sql = "SELECT place.placeID , place.name_place , place.pic_place , place.info_place , place.price_place , place.timeopen_place , place.timeclose_place , place.CloseDay , place.typeplaceID , typeplace.typeplaceID , typeplace.nametype_place FROM place , typeplace WHERE place.typeplaceID = typeplace.typeplaceID AND place.typeplaceID = 2";
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send("Database error");
            } else {
                res.send(result);
            }
        });
    } else if (request_type == 3) {
        const sql = "SELECT place.placeID , place.name_place , place.pic_place , place.info_place , place.price_place , place.timeopen_place , place.timeclose_place , place.CloseDay , place.typeplaceID , typeplace.typeplaceID , typeplace.nametype_place FROM place , typeplace WHERE place.typeplaceID = typeplace.typeplaceID AND place.typeplaceID = 3";
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send("Database error");
            } else {
                res.send(result);
            }
        });
    } else if (request_type == 4) {
        const sql = "SELECT place.placeID , place.name_place , place.pic_place , place.info_place , place.price_place , place.timeopen_place , place.timeclose_place , place.CloseDay , place.typeplaceID , typeplace.typeplaceID , typeplace.nametype_place FROM place , typeplace WHERE place.typeplaceID = typeplace.typeplaceID AND place.typeplaceID = 4";
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send("Database error");
            } else {
                res.send(result);
            }
        });
    }
});

app.get("/typeplace", function (req, res) {
    const sql = "SELECT TypeplaceID , nametype_place FROM typeplace";
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            res.send(result);
        }
    });
});

app.post("/Addplace", function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send("Upload error");
        } else {
            const filename = req.files;
            let arrayimage = "";
            for (let i = 0; i < filename.length; i++) {
                arrayimage += filename[i].filename + ",";
            }
            console.log(arrayimage);
            // res.send("done");
            const { addtypeplace, Nameplace, Infoplace, timeopen, timeclose, Dayclose, Priceplace } = req.body;
            // res.send(Nameplace+" "+Infoplace+" "+timeopen+" "+timeclose+" "+Dayclose+" "+Priceplace+" "+filename+" "+addtypeplace);
            const sql = "INSERT INTO place (name_place , pic_place , info_place , price_place , timeopen_place , timeclose_place , CloseDay , typeplaceID) VALUES (?,?,?,?,?,?,?,?)";
            con.query(sql, [Nameplace, arrayimage, Infoplace, Priceplace, timeopen, timeclose, Dayclose, addtypeplace], function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).send("Database error");
                } else {
                    if (result.affectedRows == 1) {
                        res.send("upload done");
                    } else {
                        res.send("upload fail");
                    }
                }
            });
        }
    });
});

app.post("/Editplace", function (req, res) {
    const { placeID, name_place, info_place, price_place, timeopen_place, timeclose_place, CloseDay, typeplaceID } = req.body;
    // console.log(placeID+" "+name_place+" "+info_place+" "+price_place+" "+timeopen_place+" "+timeclose_place+" "+CloseDay+" "+typeplaceID);
    const sql = "UPDATE place SET name_place=? , info_place=? , price_place=? , timeopen_place=? , timeclose_place=? , CloseDay=? , typeplaceID=? WHERE placeID=?";
    con.query(sql, [name_place, info_place, price_place, timeopen_place, timeclose_place, CloseDay, typeplaceID, placeID], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            if (result.affectedRows != 1) {
                console.log("Update ERROR");
            } else {
                // console.log(result);
                res.send("done");
            }
        }
    });
});

app.post("/Deleteplace", function (req, res) {
    const { placeID } = req.body;
    console.log(placeID);

    const sql = "DELETE FROM place WHERE placeID=?";
    con.query(sql, [placeID], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            if (result.affectedRows != 1) {
                console.log(err);
                res.status(500).send("Delete error");
            } else {
                res.send("done");
            }
        }
    });
});

app.post("/DataCar", function (req, res) {
    const request_type = req.body.type;
    console.log(request_type);
    if (request_type == undefined) {
        const sql = "SELECT * FROM car";
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send("Database error");
            } else {
                res.send(result);
            }
        });
    } else if (request_type == 1) {
        const sql = "SELECT car.carID , car.name_car , car.capacity , car.TypecarID , typecar.TypecarID , typecar.nameType_car FROM car , typecar WHERE car.TypecarID = typecar.TypecarID AND car.TypecarID =1";
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send("Database error");
            } else {
                res.send(result);
            }
        });
    } else if (request_type == 2) {
        const sql = "SELECT car.carID , car.name_car , car.capacity , car.TypecarID , typecar.TypecarID , typecar.nameType_car FROM car , typecar WHERE car.TypecarID = typecar.TypecarID AND car.TypecarID =2";
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send("Database error");
            } else {
                res.send(result);
            }
        });
    }
    // res.send("done");

});

app.post("/Deletecar", function (req, res) {
    const IDcar = req.body.IDcar;
    console.log(IDcar);

    const sql = "DELETE FROM car WHERE carID = ?";
    con.query(sql, [IDcar], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            if (result.affectedRows != 1) {
                res.status(500).send("Delete error");
            } else {
                res.send("done");
            }
        }
    });

});

app.get("/typecar", function (req, res) {
    const sql = "SELECT TypecarID , nameType_car FROM typecar";
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            res.send(result);
        }
    });
});

app.post("/Addcar", function (req, res) {
    const { name_car, capacity, TypecarID } = req.body;
    const sql = "INSERT INTO car (name_car , capacity , TypecarID) VALUES (?,?,?)";
    con.query(sql, [name_car, capacity, TypecarID], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            if (result.affectedRows != 1) {
                console.log("INSERT ERROR");
            } else {
                res.send("done");
            }
        }
    });
});

app.post("/Editcar", function (req, res) {
    const { carID, name_car, capacity, TypecarID } = req.body;
    const sql = "UPDATE car SET name_car =? , capacity =? , TypecarID =? WHERE carID=?";
    con.query(sql, [name_car, capacity, TypecarID, carID], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            if (result.affectedRows != 1) {
                console.log("Update ERROR");
            } else {
                // console.log(result);
                res.send("done");
            }
        }
    });

});

app.get("/DataHotel", function (req, res) {
    const sql = "SELECT * FROM hotel";
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            res.send(result);
        }
    });
});

app.post("/Addhotel", function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send("Upload error");
        } else {
            const filename = req.files;
            let arrayhotel = "";
            for (let i = 0; i < filename.length; i++) {
                arrayhotel += filename[i].filename + ",";
            }
            console.log(arrayhotel);
            // res.send("done");
            const { Namehotel, Pricehotel } = req.body;
            console.log(Namehotel + " " + Pricehotel + " " + filename);
            const sql = "INSERT INTO hotel ( name_hotel , pic_hotel , price_per_day ) VALUES (?,?,?)";
            con.query(sql, [Namehotel, arrayhotel, Pricehotel], function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).send("Database error");
                } else {
                    if (result.affectedRows == 1) {
                        res.send("upload done");
                    } else {
                        res.send("upload fail");
                    }
                }
            });
        }
    });

});

app.post("/Edithotel", function (req, res) {
    const { hotelID, name_hotel, price_per_day } = req.body;
    // console.log(hotelID + " " + name_hotel + " " + price_per_day);
    // res.send("done");
    const sql = "UPDATE hotel SET name_hotel =? , price_per_day =? WHERE hotelID=?";
    con.query(sql, [name_hotel, price_per_day, hotelID], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            if (result.affectedRows != 1) {
                res.status(500).send("UPDATE error");
            } else {
                res.send("done");
            }
        }
    });
});

app.post("/Deletehotel", function (req, res) {
    const { hotelID } = req.body;
    console.log(hotelID);
    // res.send("done");
    const sql = "DELETE FROM hotel WHERE hotelID=?";
    con.query(sql, [hotelID], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            if (result.affectedRows != 1) {
                res.status(500).send("DELETE error");
            } else {
                res.send("done");
            }
        }
    })
});



app.get("/Routes", function (req, res) {
    const sql = "SELECT * FROM route";
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            res.send(result);
        }
    });

});


//dropdown add route
app.post("/select_Route", function (req, res) {
    const { selectRoute } = req.body;
    console.log(selectRoute);

    const sql = "SELECT placeID , name_place FROM place WHERE placeID NOT IN (?)";
    con.query(sql, [selectRoute], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            res.send(result);
        }
    });
});

app.post("/AddRoute", function (req, res) {
    const { Origin, Destination, carID, price_route, time_route } = req.body;
    console.log(Origin + " " + Destination + " " + carID + " " + price_route + " " + time_route);
    // res.send('done');

    const sql = "INSERT INTO route ( Origin , Destination , carID , price_route , time_route ) VALUES (?,?,?,?,?)";
    con.query(sql, [Origin, Destination, carID, price_route, time_route], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            if (result.affectedRows != 1) {
                console.log(err);
                res.status(500).send("INSERT error");
            } else {
                res.send("done");
            }
        }
    });

});

app.post("/DeleteRoute", function (req, res) {
    const { Route_ID } = req.body;
    const sql = "DELETE FROM route WHERE Route_ID=?";

    con.query(sql, [Route_ID], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            if (result.affectedRows != 1) {
                console.log(err);
                res.status(500).send("DELETE error");
            } else {
                res.send("done");
            }
        }
    });
});

const PORT = 3000;
app.listen(PORT, function () {
    console.log("Server is ready at " + PORT);
});