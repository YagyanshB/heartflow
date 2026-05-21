import anthropic
import json
import os
from typing import TypedDict, List, Optional, Any
from langgraph.graph import StateGraph, END
from prompts.system_prompts import (
    TEXT_EXTRACTION_PROMPT,
    SENTIMENT_ANALYSIS_PROMPT,
    INTEREST_EXTRACTION_PROMPT,
    INTENT_ANALYSIS_PROMPT,
    NEXT_STEPS_PROMPT,
    DATE_CURATOR_PROMPT,
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
MODEL = "claude-sonnet-4-6"


class WingmanState(TypedDict):
    conversation: Optional[str]
    context: Optional[str]
    images: List[dict]
    extracted_text: str
    combined_input: str
    sentiment_data: dict
    interests_data: dict
    intent_data: dict
    next_steps_data: dict
    date_ideas_data: dict
    error: Optional[str]


def _call_claude(system: str, user_content: Any) -> str:
    if isinstance(user_content, str):
        user_content = [{"type": "text", "text": user_content}]

    response = client.messages.create(
        model=MODEL,
        max_tokens=2048,
        system=system,
        messages=[{"role": "user", "content": user_content}],
    )
    return response.content[0].text


def _parse_json(raw: str) -> dict:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


def extract_text_node(state: WingmanState) -> WingmanState:
    """Extract text from screenshots if provided."""
    extracted = ""

    if state["images"]:
        content = [{"type": "text", "text": "Please extract all conversation text from these screenshots."}]
        content.extend(state["images"])
        try:
            extracted = _call_claude(TEXT_EXTRACTION_PROMPT, content)
        except Exception as e:
            extracted = ""

    parts = []
    if state.get("context"):
        parts.append(f"[Context about this person/situation: {state['context']}]")
    if state.get("conversation"):
        parts.append(f"[Conversation transcript]\n{state['conversation']}")
    if extracted:
        parts.append(f"[Extracted from screenshots]\n{extracted}")

    return {**state, "extracted_text": extracted, "combined_input": "\n\n".join(parts)}


def sentiment_node(state: WingmanState) -> WingmanState:
    """Analyze sentiment, engagement and emotional tone."""
    try:
        raw = _call_claude(SENTIMENT_ANALYSIS_PROMPT, state["combined_input"])
        data = _parse_json(raw)
    except Exception as e:
        data = {
            "engagement_score": 0.5,
            "warmth_score": 0.5,
            "reciprocity_score": 0.5,
            "overall_sentiment": "neutral",
            "energy_level": "medium",
            "communication_style": "Unable to analyze",
            "emotional_tone_summary": str(e),
        }
    return {**state, "sentiment_data": data}


def interests_node(state: WingmanState) -> WingmanState:
    """Extract interests, shared topics, and future hooks."""
    try:
        raw = _call_claude(INTEREST_EXTRACTION_PROMPT, state["combined_input"])
        data = _parse_json(raw)
    except Exception as e:
        data = {
            "their_interests": [],
            "shared_interests": [],
            "their_name": None,
            "notable_topics": [],
            "emotional_topics": [],
            "places_mentioned": [],
            "future_hooks": [],
        }
    return {**state, "interests_data": data}


def intent_node(state: WingmanState) -> WingmanState:
    """Score romantic intent and identify green/red flags."""
    enriched = f"""
{state['combined_input']}

--- Sentiment Analysis ---
{json.dumps(state['sentiment_data'], indent=2)}

--- Interests ---
{json.dumps(state['interests_data'], indent=2)}
"""
    try:
        raw = _call_claude(INTENT_ANALYSIS_PROMPT, enriched)
        data = _parse_json(raw)
    except Exception as e:
        data = {
            "intent_score": 0.5,
            "confidence": "low",
            "invite_ready": False,
            "green_flags": [],
            "red_flags": [],
            "disinterest_signals": [],
            "mixed_signals": [],
            "stage": "unclear",
            "honest_assessment": str(e),
        }
    return {**state, "intent_data": data}


def next_steps_node(state: WingmanState) -> WingmanState:
    """Generate personalized next step recommendations."""
    enriched = f"""
{state['combined_input']}

--- Full Analysis So Far ---
Sentiment: {json.dumps(state['sentiment_data'], indent=2)}
Interests: {json.dumps(state['interests_data'], indent=2)}
Intent: {json.dumps(state['intent_data'], indent=2)}
"""
    try:
        raw = _call_claude(NEXT_STEPS_PROMPT, enriched)
        data = _parse_json(raw)
    except Exception as e:
        data = {
            "wingman_verdict": "Analysis incomplete due to an error.",
            "urgency": "proceed_with_caution",
            "next_steps": [],
            "what_not_to_do": [],
            "conversation_starters": [],
        }
    return {**state, "next_steps_data": data}


def date_curator_node(state: WingmanState) -> WingmanState:
    """Curate personalized date ideas based on interests and context."""
    enriched = f"""
{state['combined_input']}

--- Interests & Context ---
{json.dumps(state['interests_data'], indent=2)}

--- Readiness ---
Intent Score: {state['intent_data'].get('intent_score', 0.5)}
Invite Ready: {state['intent_data'].get('invite_ready', False)}
Stage: {state['intent_data'].get('stage', 'unclear')}
"""
    try:
        raw = _call_claude(DATE_CURATOR_PROMPT, enriched)
        data = _parse_json(raw)
    except Exception as e:
        data = {
            "date_ideas": [],
            "ideal_first_date": "Unable to generate date ideas.",
            "pro_tips": [],
        }
    return {**state, "date_ideas_data": data}


def build_wingman_graph():
    graph = StateGraph(WingmanState)

    graph.add_node("extract_text", extract_text_node)
    graph.add_node("sentiment", sentiment_node)
    graph.add_node("interests", interests_node)
    graph.add_node("intent", intent_node)
    graph.add_node("next_steps", next_steps_node)
    graph.add_node("date_curator", date_curator_node)

    graph.set_entry_point("extract_text")
    graph.add_edge("extract_text", "sentiment")
    graph.add_edge("sentiment", "interests")
    graph.add_edge("interests", "intent")
    graph.add_edge("intent", "next_steps")
    graph.add_edge("next_steps", "date_curator")
    graph.add_edge("date_curator", END)

    return graph.compile()


wingman_graph = build_wingman_graph()


async def run_wingman_analysis(
    conversation: Optional[str],
    context: Optional[str],
    images: List[dict],
) -> dict:
    initial_state: WingmanState = {
        "conversation": conversation,
        "context": context,
        "images": images,
        "extracted_text": "",
        "combined_input": "",
        "sentiment_data": {},
        "interests_data": {},
        "intent_data": {},
        "next_steps_data": {},
        "date_ideas_data": {},
        "error": None,
    }

    final_state = wingman_graph.invoke(initial_state)

    return {
        "engagement_score": final_state["sentiment_data"].get("engagement_score", 0),
        "warmth_score": final_state["sentiment_data"].get("warmth_score", 0),
        "reciprocity_score": final_state["sentiment_data"].get("reciprocity_score", 0),
        "overall_sentiment": final_state["sentiment_data"].get("overall_sentiment", "neutral"),
        "energy_level": final_state["sentiment_data"].get("energy_level", "medium"),
        "communication_style": final_state["sentiment_data"].get("communication_style", ""),
        "emotional_tone_summary": final_state["sentiment_data"].get("emotional_tone_summary", ""),
        "their_name": final_state["interests_data"].get("their_name"),
        "their_interests": final_state["interests_data"].get("their_interests", []),
        "shared_interests": final_state["interests_data"].get("shared_interests", []),
        "notable_topics": final_state["interests_data"].get("notable_topics", []),
        "future_hooks": final_state["interests_data"].get("future_hooks", []),
        "intent_score": final_state["intent_data"].get("intent_score", 0),
        "confidence": final_state["intent_data"].get("confidence", "low"),
        "invite_ready": final_state["intent_data"].get("invite_ready", False),
        "green_flags": final_state["intent_data"].get("green_flags", []),
        "red_flags": final_state["intent_data"].get("red_flags", []),
        "disinterest_signals": final_state["intent_data"].get("disinterest_signals", []),
        "mixed_signals": final_state["intent_data"].get("mixed_signals", []),
        "stage": final_state["intent_data"].get("stage", "unclear"),
        "honest_assessment": final_state["intent_data"].get("honest_assessment", ""),
        "wingman_verdict": final_state["next_steps_data"].get("wingman_verdict", ""),
        "urgency": final_state["next_steps_data"].get("urgency", "proceed_with_caution"),
        "next_steps": final_state["next_steps_data"].get("next_steps", []),
        "what_not_to_do": final_state["next_steps_data"].get("what_not_to_do", []),
        "conversation_starters": final_state["next_steps_data"].get("conversation_starters", []),
        "date_ideas": final_state["date_ideas_data"].get("date_ideas", []),
        "ideal_first_date": final_state["date_ideas_data"].get("ideal_first_date", ""),
        "pro_tips": final_state["date_ideas_data"].get("pro_tips", []),
    }
