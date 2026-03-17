"use client";
import { useState, useEffect, useRef } from "react";
import { Bot, Clock, Send, PlusCircle, MessageCircle } from "lucide-react";

const quickQuestions = [
	{ id: "q1", text: "What foods are best for my 3-year-old child?" },
	{ id: "q2", text: "My child is underweight, what should I do?" },
	{ id: "q3", text: "When is the next vitamin distribution?" },
	{ id: "q4", text: "How to schedule a BNS appointment?" },
	{ id: "q5", text: "What immunizations are needed at age 3?" },
	{ id: "q6", text: "Signs of proper nutrition in children" },
];

const commonTopics = [
	{
		title: "Feeding Tips",
		icon: "🍎",
		questions: [
			"What foods should I give to my child?",
			"How many meals should my child have?",
			"Best fruits for toddlers",
			"Is my child eating enough?",
		],
	},
	{
		title: "Growth Concerns",
		icon: "📏",
		questions: [
			"My child seems underweight",
			"Is my child's height normal?",
			"How to help child gain weight",
			"Signs of malnutrition",
		],
	},
	{
		title: "Immunizations",
		icon: "💉",
		questions: [
			"When is the next immunization schedule?",
			"Which vaccines are needed now?",
			"Side effects of vaccines",
			"Missed a vaccine, what now?",
		],
	},
	{
		title: "BNS Programs",
		icon: "📅",
		questions: [
			"Schedule a weighing appointment",
			"Next feeding program date",
			"How to register for food assistance",
			"Nutrition education sessions",
		],
	},
];

const initialMessages = [
	{
		id: "m1",
		content:
			"Hello Maria! I'm your BNS Nutrition Assistant. How can I help you today with Juan's nutrition and health?",
		sender: "bot",
		timestamp: new Date(),
	},
];

function ChatAssistancePage() {
	const [messages, setMessages] = useState(initialMessages);
	const [inputValue, setInputValue] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const messagesEndRef = useRef(null);
	const [topicTab, setTopicTab] = useState("Feeding Tips");

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handleSendMessage = () => {
		if (inputValue.trim() === "") return;

		const userMessage = {
			id: `user-${Date.now()}`,
			content: inputValue,
			sender: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue("");
		setIsTyping(true);

		setTimeout(() => {
			const botResponse = generateBotResponse(inputValue);
			setMessages((prev) => [...prev, botResponse]);
			setIsTyping(false);
		}, 1000);
	};

	const handleQuickQuestion = (question) => {
		const userMessage = {
			id: `user-${Date.now()}`,
			content: question,
			sender: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setIsTyping(true);

		setTimeout(() => {
			const botResponse = generateBotResponse(question);
			setMessages((prev) => [...prev, botResponse]);
			setIsTyping(false);
		}, 1000);
	};

	const generateBotResponse = (userInput) => {
		let response;
		const lowerInput = userInput.toLowerCase();

		if (lowerInput.includes("underweight") || lowerInput.includes("weight")) {
			response =
				"If Juan is underweight, focus on nutrient-dense foods. Include more protein (eggs, beans, fish), healthy fats (avocado, nuts), and carbohydrates (rice, sweet potatoes). Consider smaller, frequent meals. I recommend consulting with your BNS worker for personalized advice. Would you like to schedule an appointment?";
		} else if (
			lowerInput.includes("feeding") ||
			lowerInput.includes("food") ||
			lowerInput.includes("eat")
		) {
			response =
				"For a 3-year-old like Juan, aim for 3 main meals and 2 snacks daily. Include fruits, vegetables, protein, and whole grains. Portion sizes should be about the size of your child's fist. Limit sugary foods and ensure adequate water intake. Would you like specific meal suggestions?";
		} else if (
			lowerInput.includes("vitamin") ||
			lowerInput.includes("distribution")
		) {
			response =
				"The next Vitamin A distribution is scheduled for May 8, 2025, at 10:30 AM at the Barangay Health Center. Don't forget to bring Juan's health card. Would you like me to set a reminder for you?";
		} else if (
			lowerInput.includes("appointment") ||
			lowerInput.includes("schedule")
		) {
			response =
				"To schedule a BNS appointment, you can: 1) Use this chat to request a date, 2) Visit the Appointments tab and click 'Schedule New Appointment', or 3) Visit your local BNS center in person. What date and time would work best for you?";
		} else if (
			lowerInput.includes("immunization") ||
			lowerInput.includes("vaccine")
		) {
			response =
				"At age 3, Juan should have completed most primary vaccines. The next important one is the measles vaccine booster scheduled for May 15, 2025. Always keep your immunization card updated. Would you like me to explain the benefits of this vaccine?";
		} else {
			response =
				"Thank you for your question. I'm here to help with any nutrition or health concerns for Juan. Would you like information about feeding tips, growth monitoring, immunizations, or BNS programs?";
		}

		return {
			id: `bot-${Date.now()}`,
			content: response,
			sender: "bot",
			timestamp: new Date(),
		};
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSendMessage();
		}
	};

	const formatTime = (date) => {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	return (
		<div className="flex flex-col gap-6 text-black bg-[#f5faff] rounded-xl">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Nutrition Chat Assistance
				</h1>
				<p className="text-gray-500">
					Get 24/7 advice and answers to your nutrition questions
				</p>
			</div>

			<div className="flex gap-6">
				{/* Left Column (Header + Chat) */}
				<div className="flex-1 space-y-6">
					{/* Chat Section */}
					<div className="bg-white rounded-xl shadow p-6">
						<div className="mb-6">
							<div className="flex items-center gap-3">
								<div className="h-12 w-12 flex items-center justify-center rounded-full bg-bns-primary text-white">
									<Bot className="h-5 w-5" />
								</div>
								<div>
									<h2 className="font-semibold text-lg">
										BNS Nutrition Assistant
									</h2>
									<p className="text-sm text-gray-500 flex items-center gap-1">
										<span className="h-2 w-2 rounded-full bg-green-500"></span>{" "}
										Online • Available 24/7
									</p>
								</div>
							</div>
						</div>

						<div className="h-[500px] overflow-y-auto space-y-4 pr-2">
							{messages.map((message) => (
								<div
									key={message.id}
									className={`flex ${
										message.sender === "user" ? "justify-end" : "justify-start"
									}`}
								>
									<div
										className={`rounded-lg px-4 py-3 text-sm max-w-[70%] whitespace-pre-wrap ${
											message.sender === "user"
												? "bg-green-500 text-white"
												: "bg-gray-100 text-gray-900"
										}`}
									>
										<div>{message.content}</div>
										<div
											className={`text-xs mt-1 flex justify-end ${
												message.sender === "user"
													? "text-white/80"
													: "text-gray-500"
											}`}
										>
											<Clock className="h-3 w-3 mr-1" />{" "}
											{formatTime(message.timestamp)}
										</div>
									</div>
								</div>
							))}

							{isTyping && (
								<div className="flex justify-start">
									<div className="rounded-lg px-4 py-3 bg-gray-100 max-w-[70%]">
										<div className="flex gap-1 animate-pulse">
											<div className="w-2 h-2 bg-bns-primary rounded-full"></div>
											<div className="w-2 h-2 bg-bns-primary rounded-full"></div>
											<div className="w-2 h-2 bg-bns-primary rounded-full"></div>
										</div>
									</div>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>

						<div className="mt-4 flex items-center gap-2">
							<input
								type="text"
								placeholder="Type your message..."
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyPress={handleKeyPress}
								className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none text-sm"
							/>
							<button
								onClick={handleSendMessage}
								className="bg-green-500 p-2 rounded-full text-white hover:bg-green-600"
							>
								<Send className="h-5 w-5" />
							</button>
						</div>
					</div>
				</div>

				{/* Sidebar Section */}
				<div className="w-full lg:w-[350px] space-y-6">
					<div className="bg-white rounded-xl p-5 shadow">
						<h3 className="text-lg font-semibold mb-1">Quick Questions</h3>
						<p className="text-sm text-gray-500 mb-4">
							Common questions you might have
						</p>
						<div className="space-y-2">
							{quickQuestions.map((question) => (
								<button
									key={question.id}
									onClick={() => handleQuickQuestion(question.text)}
									className="w-full flex items-center gap-2 text-left px-3 py-2 bg-[#f0f8ff] rounded-md hover:bg-[#e6f3fb] text-sm"
								>
									<MessageCircle className="h-4 w-4 text-gray-600" />
									<span className="truncate">{question.text}</span>
								</button>
							))}
						</div>
					</div>

					<div className="bg-white rounded-xl p-5 shadow">
						<h3 className="text-lg font-semibold mb-4">Common Topics</h3>
						<div className="grid grid-cols-4 gap-2 mb-4">
							{commonTopics.map((topic, index) => (
								<button
									key={index}
									className={`w-full h-10 flex items-center justify-center rounded ${
										topicTab === topic.title
											? "bg-bns-primary text-white"
											: "bg-gray-100 hover:bg-gray-200"
									}`}
									onClick={() => setTopicTab(topic.title)}
								>
									{topic.icon}
								</button>
							))}
						</div>

						{commonTopics
							.filter((topic) => topic.title === topicTab)
							.map((topic, index) => (
								<div key={index}>
									<h4 className="font-medium text-sm mb-2">{topic.title}</h4>
									<div className="space-y-2">
										{topic.questions.map((question, i) => (
											<button
												key={i}
												onClick={() => handleQuickQuestion(question)}
												className="flex items-center gap-2 w-full text-left text-sm py-1 px-2 rounded hover:bg-gray-50"
											>
												<PlusCircle className="h-4 w-4 text-green-500" />
												{question}
											</button>
										))}
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChatAssistancePage;
