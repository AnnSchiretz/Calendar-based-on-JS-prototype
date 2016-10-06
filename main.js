! function () {
    var today = moment();
    moment.locale('be');
    moment().format('LL');

    function Calendar(selector, events) {
        this.el = document.querySelector(selector);
        this.events = events;
        this.current = moment().date(1);
        this.draw();
        var current = document.querySelector('.today');
        if (current) {
            var self = this;
            window.setTimeout(function () {
                self.openDay(current);
            }, 500)
        }
    };
    Calendar.prototype.draw = function () {
        this.drawCalendar();
        this.drawEvents();
    };
    Calendar.prototype.drawCalendar = function () {
        if (!this.calendar) {
            this.calendar = createElement('div', 'calendar');
            this.calendar.className = 'calendar';
            this.el.appendChild(this.calendar);
        }
        this.drawCalendarHeader();
        this.drawCalendarBody();
    };
    Calendar.prototype.drawCalendarHeader = function () {
        var self = this
            , left, right, left_child, right_child;
        if (!this.calendarHeader) {
            this.calendarHeader = createElement('div', 'calendar-header');
            this.calendarHeader.className = 'calendar-header';
            this.title = createElement('h3');
            left = createElement('span', 'prev');
            left_child = createElement('i', 'fa fa-chevron-left');
            left_child.className = 'fa fa-chevron-left';
            left.addEventListener('click', function () {
                self.prevMonth();
            });
            right = createElement('span', 'next');
            right_child = createElement('i', 'fa fa-chevron-right');
            right_child.className = 'fa fa-chevron-right';
            right.addEventListener('click', function () {
                self.nextMonth();
            });
            left.appendChild(left_child);
            this.calendarHeader.appendChild(left);
            this.calendarHeader.appendChild(this.title);
            right.appendChild(right_child);
            this.calendarHeader.appendChild(right);
            this.calendar.appendChild(this.calendarHeader);
        }
        this.title.innerHTML = this.current.format('MMMM YYYY');
    };
    Calendar.prototype.drawCalendarBody = function () {
        if (!this.calendarBody) {
            this.calendarBody = createElement('div', 'calendar-body');
            this.calendarBody.className = 'calendar-body';
            this.calendar.appendChild(this.calendarBody);
        }
        this.drawWeekDays();
        this.drawMonth();
    };
    
    Calendar.prototype.drawWeekDays = function() {
        
        if (!this.calendarDay) {
            var weekDays = ['нд', 'пн', 'ат', 'ср', 'чц', 'пт', 'сб'];
            this.calendarDay = createElement('div', 'days');
            this.calendarDay.className = 'days';
            
            var ul = createElement('ul');
            
            for (var i = 0; i < weekDays.length; i++) {
                var li = createElement('li', 0, weekDays[i]);
                ul.appendChild(li);
            }
            this.calendarDay.appendChild(ul);
            this.calendarBody.appendChild(this.calendarDay);
        }
    };
    
    Calendar.prototype.drawMonth = function () {
        var self = this;
        if (this.month) {
            this.oldMonth = this.month;
            this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
            this.oldMonth.addEventListener('webkitAnimationEnd', function () {
                self.oldMonth.parentNode.removeChild(self.oldMonth);
                self.month = createElement('div', 'month');
                self.backFill();
                self.currentMonth();
                self.forwardFill();
                self.calendarBody.appendChild(self.month);
                window.setTimeout(function () {
                    self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
                }, 16);
            });
        }
        else {
            this.month = createElement('div', 'month');
            this.calendarBody.appendChild(this.month);
            this.backFill();
            this.currentMonth();
            this.forwardFill();
            this.month.className = 'month new';
        }
    };
    Calendar.prototype.nextMonth = function () {
        this.current.add(1, 'months');
        this.next = true;
        this.draw();
    };
    Calendar.prototype.prevMonth = function () {
        this.current.subtract(1, 'months');
        this.next = false;
        this.draw();
    };
    Calendar.prototype.backFill = function () {
        var clone = this.current.clone();
        var dayOfWeek = clone.day();
        if (!dayOfWeek) {
            return;
        }
        clone.subtract(dayOfWeek + 1, 'days');
        for (var i = dayOfWeek; i > 0; i--) {
            this.drawDay(clone.add(1, 'days'));
        }
    };
    Calendar.prototype.forwardFill = function () {
        var clone = this.current.clone().add(1, 'months').subtract(1, 'days');
        var dayOfWeek = clone.day();
        if (dayOfWeek === 6) {
            return;
        }
        for (var i = dayOfWeek; i < 6; i++) {
            this.drawDay(clone.add(1, 'days'));
        }
    };
    Calendar.prototype.getWeek = function (day) {
        if (!this.week || day.day() === 0) {
            this.week = createElement('div', 'week');
            this.month.appendChild(this.week);
        }
    };
    Calendar.prototype.drawDay = function (day) {
        var self = this;
        this.getWeek(day);
        var outer = createElement('div', this.getClassDay(day));
        outer.addEventListener('click', function () {
            self.openDay(this);
        });
        //var name = createElement('div', 0, day.format('ddd'));
        var number = createElement('div', 'day-number', day.format('DD'));
        var events = createElement('div', 'day-events');
        outer.appendChild(number);
        outer.appendChild(events);
        this.week.appendChild(outer);
    };
    Calendar.prototype.openDay = function (el) {
        var event,
            dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent,
            day = this.current.clone().date(dayNumber);

        var currentOpened = document.querySelector('.event');

        if (currentOpened && currentOpened.parentNode === el.parentNode) {
            event = currentOpened;
        } else {
            if (currentOpened) {
                currentOpened.addEventListener('webkitAnimationEnd', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.addEventListener('oanimationend', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.addEventListener('msAnimationEnd', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.addEventListener('animationend', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.className = 'event out';
            }
            event = createElement('div', 'event in');
            this.eventsBody.appendChild(event);
        }
        this.headerCurrentDay.innerHTML = day.format('DD.MM.YYYY ' + '(dddd)');
    };
    Calendar.prototype.currentMonth = function () {
        var clone = this.current.clone();
        while (clone.month() === this.current.month()) {
            this.drawDay(clone);
            clone.add(1, 'days');
        }
    };

    Calendar.prototype.getClassDay = function (day) {
        var classes = ['day'];
        if (day.month() !== this.current.month()) {
            classes.push('other');
        }
        else if (today.isSame(day, 'day')) {
            classes.push('today');
        }
        return classes.join(' ');
    };
    Calendar.prototype.drawEvents = function () {
        if (!this.Events) {
            this.Events = createElement('div', 'events');
            this.Events.className = 'events';
            this.el.appendChild(this.Events);
        }
        this.drawEventsHeader();
        this.drawEventsBody();
    };
    Calendar.prototype.drawEventsHeader = function () {
        if (!this.eventsHeader) {
            this.eventsHeader = createElement('div', 'events-header');
            this.eventsHeader.className = 'events-header';
            this.headerTitle = createElement('h2', 0, 'Мерапрыемства');
            this.headerCurrentDay = createElement('span', 0, this.calendarDay);
            this.eventsHeader.appendChild(this.headerTitle);
            this.eventsHeader.appendChild(this.headerCurrentDay);
            this.Events.appendChild(this.eventsHeader);
        }
    };
    Calendar.prototype.drawEventsBody = function () {
        if (!this.eventsBody) {
            this.eventsBody = createElement('div', 'events-body');
            this.eventsBody.className = 'events-body';
            this.Events.appendChild(this.eventsBody);
        }
    };
    /* === Функция создает новые элементы === */
    function createElement(tagName, className, innerText) {
        var ele = document.createElement(tagName);
        if (className) {
            ele.className = className;
        }
        if (innerText) {
            ele.innerText = ele.textContent = innerText;
        }
        return ele;
    };
    window.Calendar = Calendar;
}();
(function () {
    var data = [
        {date: '2016-10-07'}
    ];
    var calendar = new Calendar('#widget', data);
}());