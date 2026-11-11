<script setup>
import CrewGuide from '../components/CrewGuide.vue'
import { NASYAI } from '../config/nasyai.js'
</script>

<template>
  <main id="main" class="page">
    <section class="band band--first">
      <div class="well">
        <div class="statement">
          <p class="statement-kicker">Privacy · no ads, no analytics, no tracking</p>
          <h1 class="statement-title mega">What we collect, and why.</h1>
          <p class="statement-lede">Very little. The site needs nothing about you to work and sets no cookies. A holder sign-in is the one thing it keeps in your browser beyond the tab.</p>
          <CrewGuide />
        </div>
      </div>
    </section>

    <section class="band">
      <div class="well well--narrow band-in">
        <div class="ledger-wrap">
          <table class="ledger">
            <tbody>
              <tr>
                <th>Your visits</th>
                <td>The host keeps standard request logs (IP address, browser, page) for a short time to run and protect the site. Shared with the hosting provider only.</td>
              </tr>
              <tr>
                <th>Chain reads</th>
                <td>The board and stock pages read Robinhood Chain straight from your browser through public RPC nodes (PublicNode, Robinhood). Those nodes see your IP address and which contracts were read.</td>
              </tr>
              <tr>
                <th>Your wallet</th>
                <td>When you connect a wallet, its address is read to show your lines and positions. Anything you sign is public on chain by design. We never see your keys.</td>
              </tr>
              <tr>
                <th>Ask Nasyai</th>
                <td>The Ask Nasyai chat runs on Grok. Your questions, the conversation so far and the page you are on go through our server to xAI to be answered, and xAI's own privacy policy covers what it keeps. We store none of it. Do not type keys, seed phrases or anything private into it.</td>
              </tr>
              <tr>
                <th>This browser</th>
                <td>No cookies. Session storage holds the wallet you last connected, your open chats with the crew, and which pages the crew has already said hello on, for this tab only. If you sign in as a $NASYAI holder, local storage keeps that sign-in (your address and a key that expires after 7 days) until you sign out.</td>
              </tr>
              <tr>
                <th>Holder links</th>
                <td>If you link an X account to your wallet for Nasyai on X, we keep that pair (X user id, username, wallet) so Nasyai knows who to answer. Unlink on the $NASYAI page and it is deleted. Nasyai on X keeps a short log of the posts it answered.</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>If you write to us, we keep the conversation to answer it, and delete it on request.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="dim" style="margin-top: 22px">Questions or requests: <b>{{ NASYAI.links.email }}</b></p>
      </div>
    </section>
  </main>
</template>
