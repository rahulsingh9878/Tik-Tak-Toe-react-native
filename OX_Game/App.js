import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import io from "socket.io-client";


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      OX: "O",
      Counter: 0,
      flag:0,
      chance:"Player 1",
      lock: 0,
      bingo: [
        { key: 0, value: "", mark: 0 },
        { key: 1, value: "", mark: 0 },
        { key: 2, value: "", mark: 0 },
        { key: 3, value: "", mark: 0 },
        { key: 4, value: "", mark: 0 },
        { key: 5, value: "", mark: 0 },
        { key: 6, value: "", mark: 0 },
        { key: 7, value: "", mark: 0 },
        { key: 8, value: "", mark: 0 }
      ]
    };

  }

  componentDidMount() {
    
    this.socket = io("http://192.168.0.124:3000");
    this.socket.on("chat message", msg => {
      
      this.changeTitle(msg);
       
    });

  }

  sendThe = a => {
    if (this.state.bingo[a].value === ""){
    this.socket.emit("chat message", a);
    this.setState({ lock:1 })
  }
  }
  changeTitle = a => {
    let ox = this.state.OX;
    if (this.state.bingo[a].value === "") {
      let newMarkers = this.state.bingo.map(el =>
        el.key === a ? { ...el, value: ox } : el
      );
      this.setState({ bingo: newMarkers });
      if (ox === "O") {
        this.setState({ OX: "X",
        Counter: this.state.Counter + 1,
        chance: "Player 2"
      });
      } else {
        this.setState({ OX: "O",
        Counter: this.state.Counter + 1,
        chance: "Player 1"
      });
      }
      if(this.state.lock===1){
        this.setState({flag:this.state.flag+1})
      }
      if(this.state.flag===2){
        this.setState({flag:0,
        lock:0
        })
      }
      if (this.state.Counter > 4) this.winCheck(ox);
    }
  };


  renderIf(condition, element) {
    if (condition === 9) {
      return element;
    }
  }

  winCheck = (a) => {
    let num = this.state.bingo;

    if (
      num[0].value === num[1].value &&
      num[1].value === num[2].value &&
      num[2].value !== ""
    ) {
      this.winAlert(a);
    } else if (
      num[3].value === num[4].value &&
      num[4].value === num[5].value &&
      num[4].value !== ""
    ) {
      this.winAlert(a);
    } else if (
      num[6].value === num[7].value &&
      num[7].value === num[8].value &&
      num[7].value !== ""
    ) {
      this.winAlert(a);
    } else if (
      num[0].value === num[3].value &&
      num[3].value === num[6].value &&
      num[3].value !== ""
    ) {
      this.winAlert(a);
    } else if (
      num[4].value === num[1].value &&
      num[1].value === num[7].value &&
      num[1].value !== ""
    ) {
      this.winAlert(a);
    } else if (
      num[2].value === num[5].value &&
      num[5].value === num[8].value &&
      num[5].value !== ""
    ) {
      this.winAlert(a);
    } else if (
      num[2].value === num[4].value &&
      num[4].value === num[6].value &&
      num[4].value !== ""
    ) {
      this.winAlert(a);
    } else if (
      num[0].value === num[4].value &&
      num[4].value === num[8].value &&
      num[4].value !== ""
    ) {
      this.winAlert(a);
    }
  };

  winAlert = a => {
    if (a === "O") {
      alert("Player 1 Win");
    } else {
      alert("Player 2 Win");
    }
    this.setState({ lock: 1,
      Counter : 9
    });
  };

  unDo = () => {
    let newMarkers = this.state.bingo.map(
      el => (el.key = { ...el, value: "" })
    );
    this.setState({
      bingo: newMarkers,
      lock: 0,
      OX: "O",
      Counter: 0,
      chance: "Player 1"
    });
  };

  

  loadSqu = idexnum => {
    const bingo = this.state.bingo;
    return (
      <View style={styles.cont}>
        {bingo.map((key, index) =>
          index < 3 ? (
            <TouchableOpacity
            disabled={this.state.lock}
              style={
                styles.btn
              
              }
              onPress={() =>
                this.sendThe(this.state.bingo[index + idexnum].key)
              }
            >
              <Text style={styles.title}>
                {this.state.bingo[index + idexnum].value}
              </Text>
            </TouchableOpacity>
          ) : null
        )}
      </View>
    );
  };

  render() {
    return (
      <View style={styles.mainView}>
       <View style={styles.chanceCard}>
       <View style={{backgroundColor:"#2f2f2f"}}><Text style={styles.titleText}>
         Tik Tok Toe</Text></View>
        <Text style={styles.chanceText}>Chance of {this.state.chance}</Text>
       </View>
        <View style={styles.grid}>
          {this.loadSqu(0)}
          {this.loadSqu(3)}
          {this.loadSqu(6)}
        </View>
        <View style={styles.menu}>
          {this.renderIf(
            this.state.Counter,
            <TouchableOpacity
              style={styles.menuBtn}
              onPress={() => this.unDo()}
            >
              <Text style={styles.menuBtnText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor:"#2f2f2f",
    marginTop:25,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

  },
  chanceCard:{
    alignItems: "stretch",
    width:1000,
    backgroundColor:'#6f6f6f',
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 5
  },
  grid: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center"
  },
  menu: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  titleText: {
    fontFamily: "monospace",
    fontSize: 45,
    padding: 8,
    textAlign: "center",
    color: "white"
  },
  menuBtnText: {
    fontFamily: "monospace",
    fontSize: 20,
    padding: 8,
    textAlign: "center",
    color: "white"
  },
  menuBtn: {
    height: 50,
    width: 100,
    borderRadius: 10,
    backgroundColor: "#626673",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 5
  },
  btn: {
    height: 75,
    width: 75,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 4,
    backgroundColor: "#6f6f6f",
    borderRadius: 5,
    marginVertical: 2,
    marginHorizontal: 2,
    justifyContent:"center",
    textAlign: "center"
  },
  cont: {
    flexDirection: "row"
  },
  title: {
    fontWeight: "bold",
    fontSize: 35,
    fontWeight:"bold",
    textAlign: "center",
    padding: 10,
    color: "white"
  },
  chanceText: {
    fontSize: 20,
    fontWeight:"bold",
    padding: 10,
    textAlign: "center",
    color: "#d9dce2"
  }
});

export default App;
