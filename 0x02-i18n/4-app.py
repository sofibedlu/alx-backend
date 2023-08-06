#!/usr/bin/env python3
"""
Flask App
"""

from flask import Flask, render_template, request
from flask_babel import Babel

app = Flask(__name__)


class Config:
    """define configurations"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


babel = Babel(app)
app.config.from_object(Config)


@babel.localeselector
def get_locale():
    """determine the user's preferred locale"""

    requested_locale = request.args.get('locale')
    if requested_locale in app.config['LANGUAGES']:
        return requested_locale

    supported_languages = app.config['LANGUAGES']
    return request.accept_languages.best_match(supported_languages)


@app.route('/')
def index():
    """return index"""
    return render_template('3-index.html')


if __name__ == "__main__":
    """ Main Function """
    app.run()
