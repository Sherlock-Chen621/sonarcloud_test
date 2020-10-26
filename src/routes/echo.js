"use strick"

const echo = async function () {
    return res.status(200).json({
        status: 200,
        message: "Hello"
    });
}

export {
    echo
}