#!/usr/bin/env python3
"""
Flask App
"""

from flask import Flask, render_template, request, g
from flask_babel import Babel
from typing import Dict

app = Flask(__name__)


users = {
        1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
        2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
        3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
        4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


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


def get_user(user_id: int) -> Dict:
    """Retrieve user information from the mock user table."""
    return users.get(user_id)


@app.before_request
def before_request() -> None:
    """Before each request, retrieve and set the user
    information for the current request.
    """
    user_id = request.args.get('login_as')
    g.user = get_user(int(user_id)) if user_id else None


@app.route('/')
def index():
    """return index"""
    return render_template('5-index.html')


if __name__ == "__main__":
    """ Main Function """
    app.run()
