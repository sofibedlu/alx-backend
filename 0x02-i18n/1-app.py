#!/usr/bin/env python3
"""
Flask App
"""

from flask import Flask, render_template
from flask_babel import Babel

app = Flask(__name__)


class Config:
    """define configurations"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


babel = Babel(app)
app.config.from_object(Config)


@app.route('/')
def index():
    """return index"""
    return render_template('1-index.html')


if __name__ == "__main__":
    """ Main Function """
    app.run()
