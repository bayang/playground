# -*- coding: utf-8 -*-
"""User views."""
from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required

blueprint = Blueprint('user', __name__, url_prefix='/users', static_folder='../static')


@blueprint.route('/', methods=['GET', 'POST'])
@login_required
def members():
    """List members."""
    if request.method == "POST":
        message = request.form['message']
        flash('Just kidding ! Message sending is broken, here is your message : ' + message, 'success')
        return redirect(url_for('user.members'))
    return render_template('users/members.html')
