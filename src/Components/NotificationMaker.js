import React from "react";
// import { geolocated } from "react-geolocated";
import { firestore } from "./../firebase";

class NotificationMaker extends React.Component {
  state = {
    events: [],
    showPopUpWindow: false,
    currentLocation: []
  };

  componentDidMount() {
    setTimeout(() => { this.init(); }, 1000); // 1000 mili seconds = 1 second before pop up window will be showed
  }

  closePopUpWindow = () => { 
    this.setState({ 
      showPopUpWindow: false
     });
  }

  toRadians(degrees) { return degrees * Math.PI / 180; }

  getLocation() {
    if (navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({ currentLocation: [ position.coords.latitude, position.coords.longitude ] })
      },
        (error) => { throw new Error(error); });
    }
    else{
      throw new Error("Geolocation is not supported by this browser!");
    }
  }

  calculateDistance(position1, position2) {
    var R = 6371e3; // metres
    var φ1 = this.toRadians(position1[0]);
    var φ2 = this.toRadians(position2[0]);
    var Δφ = this.toRadians((position2[0] - position1[0]));
    var Δλ = this.toRadians((position2[1] - position1[1]));
    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;

    return d;
  }

  async init() {

    await this.getLocation();

    var documentReference = firestore.collection("Events").doc("Event");

    documentReference.get().then(documentSnapshot => {
      if (documentSnapshot.exists){
        var data = documentSnapshot.data();
        this.setState({ 
          events: { 
            name: data.name, 
            time: data.date.toDate().toString(), 
            description : data.description, 
            distance: this.calculateDistance(
              [ data.location.latitude, data.location.longitude ],
              this.state.currentLocation).toFixed(2)  // we showing only two numbers after dot
          } 
        });
        // console.log(this.state.events);
        this.setState({ showPopUpWindow: true });
      }
      else
      {
        console.log('document not found');
      }
    });
  }

  render(){
    return (
      <>
        <div className="pop-up-window" style={ this.state.showPopUpWindow ? { display: 'block' } : { display: 'none' } }>
          <div className="container">
            <div className="text">
                <h4>List of Events</h4>
                <p><span>Name: </span>{this.state.events.name}</p>
                <p><span>Distance: </span>{this.state.events.distance}</p>
                <p><span>Time: </span>{this.state.events.time}</p>
            </div>
            <div className="buttons">
                <button className="cancel" onClick={ this.closePopUpWindow }>Cancel</button>
                <button className="info">Info</button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default NotificationMaker;