import React , { Component , useState , useEffect } from 'react';
import { Row , Col , Progress  , Button , Modal } from 'antd';
import 'antd/dist/antd.css';
import Together from '../Images/player.png';
class FightView extends Component{
	constructor(props){
		super(props);
	}
	state={
		winner : null , 
		enemy : {
			"currentHp":400 ,
			"maxHp":400 ,
			"name" : "客戶" ,
			"sprite" : "azure.png" ,
			"type" : "enemy" , 
			"LV" : 20 , 
			"skill":[
				{
					"type":"attack" ,
					"name" : "MISS SLA" ,
					"value" : 20 ,
					"totalCount" : 1 ,
					"use" : 0
				} , 
				{
					"type":"attack" ,
					"name" : "CC Jacob" ,
					"value" : 10 ,
					"totalCount" : 1 ,
					"use" : 0
				} , 
				{
					"type":"attack" ,
					"name" : "Any update" ,
					"value" : 30 ,
					"totalCount" : 1 ,
					"use" : 0
				}, 
				{
					"type":"attack" ,
					"name" : "Call TAM" ,
					"value" : 100 ,
					"totalCount" : 1 ,
					"use" : 0
				}
			]
		} , 
		player : {
			"currentHp":200 ,
			"maxHp":200 ,
			"name" : "Jon" ,
			"sprite" : "splayer.png" ,
			"type" : "player" , 
			"LV" : 1,
			"skill":[
				{
					"type":"attack" ,
					"name" : "call 客戶" ,
					"value" : 20 ,
					"totalCount" : 1 ,
					"use" : 0
				} , 
				{
					"type":"heal" ,
					"name" : "跟penny聊天" ,
					"value" : 30 ,
					"totalCount" : 30 ,
					"use" : 0
				} ,
				{
					"type":"attack" ,
					"name" : "做LAB" ,
					"value" : 10,
					"totalCount" : 999 ,
					"use" : 0
				} ,
				{
					"type":"stronger" ,
					"name" : "招喚文森哥" ,
					"value" : 100,
					"totalCount" : 1 ,
					"use" : 0
				}
			]
		} , 
		gameStage : 0 //表示遊戲尚未開始 奇數為玩家操作 , 偶數為npc
		
	}
	renderGameEnd(){
		const { winner } = this.state ; 
		if(winner == null) { return ; }
		if(winner == "player"){
			
			return (
				<Modal
					title="你贏了"
					visible={(winner == null) ? false : true}
					onOk={()=>{}}
					onCancel={()=>{}}
				>
					<p>贏得Penny</p>
					<p>
						<img src={Together}></img>
					</p>
					<p>
						請繼續完成你的旅程
						<div>git</div>
						<a target="_blank" href="https://github.com/kuomingwu/jon-penny.git">https://github.com/kuomingwu/jon-penny.git</a>
					</p>
				</Modal>
			
			)
			
			
		}
		if(winner == "enemy"){
			return (
				<Modal
					title="你輸了"
					visible={(winner == null) ? false : true}
					onOk={()=>{}}
					onCancel={()=>{}}
				>
					<p>繼續接case吧</p>
					<p>
						J : 你跑不掉的
					</p>
				</Modal>
			)
			
		}
	}
	skillCallback({ skill , self , target }){
		console.info("use skill :" , { skill , self , target });
		let selfEntity = this.state[self];
		let targetEntity = this.state[target];
		if(skill.type == "attack"){
			
			
			targetEntity.currentHp = targetEntity.currentHp - skill.value ;
			
		}
		if(skill.type == "heal"){
			
			if(selfEntity.currentHp + skill.value <= selfEntity.maxHp){
				selfEntity.currentHp = selfEntity.currentHp + skill.value ;
			}else{
				
				selfEntity.currentHp = selfEntity.maxHp ; 
			}
			
		}
		if(skill.type == "stronger"){
			selfEntity.skill.map((s)=>{
				s.value += skill.value ;
			})
			selfEntity.maxHp = selfEntity.maxHp + skill.value ;
			
		}
		
		if(targetEntity.currentHp <= 0){
			
			this.setState({ winner : self });
			return ;
		}
		
		this.setState({ [self] : selfEntity , [target] : targetEntity , gameStage : ( this.state.gameStage + 1) })
	}
	render(){
		const { enemy , player , gameStage } = this.state ; 
		console.info({ player , enemy });
		return (
			<Row>
				<Entity data={enemy} gameStage={gameStage} 
					skillCallback={(skill)=>{
						//施放skill
						this.skillCallback({ skill , self : "enemy" , target : "player"  });
					}}
				/>
				<Entity data={player} gameStage={gameStage} 
					skillCallback={(skill)=>{
						//施放skill
						this.skillCallback({ skill , self : "player" , target : "enemy" });
					}}
					onStartGame={()=>{
						this.setState({ gameStage : 1 });
						
					}}
					endGame={({ winner })=>{
						this.setState({ winner });
						
					}}
				/>
				{
					this.renderGameEnd()
				}
			</Row>
		)
	}
	
	
	
}

function Entity({ data , onStartGame , gameStage , skillCallback , endGame }){
	const { type } = data ; 
	const [name , setName] = useState(data.name); 
	const [maxHp , setMaxHp] = useState(data.maxHp);
	const [currentHp , setCurrentHp ] = useState(data.currentHp);
	const [sprite , setSprite] = useState(data.sprite);
	const [LV , setLV] = useState(data.LV);
	const [skill , setSkill] = useState(data.skill);
	const [ currentSkillName , setCurrentSkillName ] = useState("");
	useEffect(() =>{ 
		
		setCurrentHp(data.currentHp) 
		
	}, [data.currentHp ]);
	useEffect(() =>{ 
		
		setMaxHp(data.maxHp) 
		
	}, [data.maxHp ]);
	useEffect(() =>{ 
		
		console.info("gameStage change : " , gameStage);
		if(gameStage % 2 == 0 && gameStage !==0 && type =="enemy"){
			npcSkill();
		}
		
	}, [gameStage]);
	
	function randomSkill(skill) {
		return skill[Math.floor(Math.random() * skill.length)];
	}
	
	function sleep(second){
		return new Promise((resolve , reject)=>{
		
			setTimeout(()=>{
				return resolve();
			} , second)
		
		})
	}
	
	async function npcSkill() {
		//假設是npc 隨機出一個招式
		let useSkill = randomSkill(skill);
			
		setCurrentSkillName(useSkill.name);
		setTimeout(()=>{
			
			
			skillCallback(useSkill);
			setCurrentSkillName("");
		} , 1000)
		
		
    }
	
	function renderPlane(){
		if(gameStage == 0) {
		
			return (
				<>
					<Col md={12} xs={12}>
						What will { name } do ?
					</Col>
					<Col md={12} xs={12}>
						<Col md={12} xs={12}>
							<Button onClick={()=>{
								onStartGame();
							}}>接case</Button>
						</Col>
						<Col md={12} xs={12}>
							翻開jack筆記
						</Col>
						<Col md={12} xs={12}>
							call其他team member
						</Col>
						<Col md={12} xs={12} >
							<Button onClick={()=>{
							endGame({ winner : "player" });
						}}>辭職</Button>
						</Col>
					</Col>
				</>
			)
		}
		if(gameStage % 2 > 0) {
			//玩家操控
			return (
				<Row>
				{
					skill.map((s)=><Col md={6}><Button onClick={()=>skillCallback(s)}>{s.name}</Button></Col>)
				}
				</Row>
			)
			
		}
	}
	
	return (
		<Row className="entity">
		{
			(type == "enemy") ? 
				<Col md={24} xs={24}>
					<Col md={12} xs={12}>
						<Col md={24} xs={24}>
							<Col md={12} xs={12}>
								{ name }
							</Col>
							<Col md={12} xs={12}>
								LV : { LV }
							</Col>
						</Col>
						<Progress percent={currentHp / maxHp*100} />
						<div><span>{ currentHp }</span> / <span>{ maxHp }</span></div>
					</Col>
					
					<Col md={12} xs={12}>
						<h2>{ currentSkillName }</h2>
						<img className="sprite" src={ require(`../Images/${sprite}`) } />
					</Col>
					
				</Col>
			 : 
				<Col md={24} xs={24}>
					<Col md={12} xs={12}>
						<img className="sprite" src={ require(`../Images/${sprite}`) } />
						<Col md={24} xs={24}>
							<h2>{ currentSkillName }</h2>
						</Col>
					</Col>
					<Col md={12} xs={12}>
						<Col md={24} xs={24}>
							<Col md={12} xs={12}>
								{ name }
							</Col>
							<Col md={12} xs={12}>
								LV : { LV }
							</Col>
						</Col>
						<Progress percent={currentHp / maxHp*100} />
						<div><span>{ currentHp }</span> / <span>{ maxHp }</span></div>
					</Col>
					
					<Col md={24} xs={24}>
						{
							renderPlane()
							
						}
						
					
					</Col>
				</Col>
		}
			
		</Row>
	)
	
}


export default FightView ; 